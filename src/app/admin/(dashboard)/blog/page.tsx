"use client";

import * as React from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert } from "@/components/ui/alert";
import { AdminStatusBadge } from "@/components/admin/status-badge";
import { blogPosts as fallbackBlogPosts } from "@/data/blog-content";
import { teamMembers } from "@/data/team";
import { categoryLabels } from "@/lib/content-helpers";
import { formatDate, slugify } from "@/lib/utils";
import { can } from "@/lib/permissions";
import { useSession } from "next-auth/react";
import { fetchWithFallback } from "@/lib/admin-api";
import type { BlogPost } from "@/types";

interface DbBlogPost {
  slug: string;
  title: string;
  status: "DRAFT" | "PUBLISHED";
  excerpt: string;
  content: string[];
  heroImage: string;
  publishedAt: string | null;
  readingTimeMinutes: number;
  category: { slug: string };
  author: { id: string; name: string };
}

const emptyPost: BlogPost = {
  slug: "",
  title: "",
  category: "company-news",
  status: "Draft",
  excerpt: "",
  content: [],
  heroImage: "/images/blog/process-blog.jpg",
  authorId: teamMembers[0]?.id ?? "",
  publishedAt: new Date().toISOString().slice(0, 10),
  readingTimeMinutes: 5,
};

/**
 * Blog Manager — full create/edit/delete + Draft/Published toggle.
 * Rich-text editing is represented here as plain paragraph-per-line
 * text (matching BlogPost.content's paragraph-array shape) rather
 * than a WYSIWYG editor — swap in a real rich-text editor component
 * when the backend/CMS phase adds one, without changing this file's
 * data flow.
 */
export default function BlogManagerPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "editor";

  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editingPost, setEditingPost] = React.useState<BlogPost | null>(null);
  const [isNew, setIsNew] = React.useState(false);
  const [savedNotice, setSavedNotice] = React.useState(false);

  const canCreate = can(role, "blog", "create");
  const canEdit = can(role, "blog", "edit");
  const canDelete = can(role, "blog", "delete");

  // GET is wired to the real API (with graceful fallback below). Create/
  // edit/delete remain local-state for now: BlogPost.authorId in the
  // frontend/fallback data references src/data/team.ts (TeamMember),
  // but the database's BlogPost.authorId is a foreign key to the `users`
  // table (Auth.js accounts) — a deliberately different entity, since
  // not every team member necessarily has a login. POST /api/blog also
  // always attributes new posts to the signed-in session's user, not
  // an arbitrary authorId in the request body. Reconciling "byline
  // author" (TeamMember) vs "system author" (User) needs a product
  // decision — e.g. adding an optional TeamMember relation on BlogPost
  // for the public byline — rather than a silent admin-side workaround.
  React.useEffect(() => {
    fetchWithFallback<DbBlogPost[] | BlogPost[]>("/api/blog", fallbackBlogPosts)
      .then((data) => {
        const normalized: BlogPost[] = data.map((raw) => {
          const isDbShape = "category" in raw && typeof (raw as DbBlogPost).category === "object";
          if (isDbShape) {
            const db = raw as DbBlogPost;
            const knownAuthor = teamMembers.find((m) => m.name === db.author.name);
            return {
              slug: db.slug,
              title: db.title,
              category: db.category.slug as BlogPost["category"],
              status: db.status === "PUBLISHED" ? "Published" : "Draft",
              excerpt: db.excerpt,
              content: db.content,
              heroImage: db.heroImage,
              authorId: knownAuthor?.id ?? teamMembers[0]?.id ?? "",
              publishedAt: db.publishedAt ?? new Date().toISOString(),
              readingTimeMinutes: db.readingTimeMinutes,
            };
          }
          return raw as BlogPost;
        });
        setPosts(normalized);
      })
      .finally(() => setLoading(false));
  }, []);

  function handleSave(post: BlogPost) {
    setPosts((prev) => {
      const exists = prev.some((p) => p.slug === post.slug);
      return exists ? prev.map((p) => (p.slug === post.slug ? post : p)) : [post, ...prev];
    });
    setEditingPost(null);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  function handleDelete(slug: string) {
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  }

  return (
    <>
      <AdminPageHeader
        title="Blog Manager"
        description="Create, edit, and publish blog posts."
        action={
          <Button
            disabled={!canCreate}
            onClick={() => {
              setEditingPost(emptyPost);
              setIsNew(true);
            }}
          >
            <Plus className="size-[16px]" aria-hidden="true" />
            New Post
          </Button>
        }
      />

      {savedNotice && (
        <Alert variant="success" title="Saved" className="mb-4">
          Changes are held locally until author attribution is reconciled (see code comment) — the list above is live from the database.
        </Alert>
      )}

      {loading ? (
        <p className="text-body text-neutral-600">Loading blog posts…</p>
      ) : (
      <Table>
        <TableCaption>All blog posts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.slug}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell className="text-neutral-600">{categoryLabels[post.category]}</TableCell>
              <TableCell><AdminStatusBadge status={post.status} /></TableCell>
              <TableCell className="text-neutral-600">
                {teamMembers.find((m) => m.id === post.authorId)?.name ?? "—"}
              </TableCell>
              <TableCell className="text-neutral-600">{formatDate(post.publishedAt)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!canEdit}
                  onClick={() => {
                    setEditingPost(post);
                    setIsNew(false);
                  }}
                >
                  <Pencil className="size-[16px]" aria-hidden="true" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!canDelete}
                  onClick={() => handleDelete(post.slug)}
                  className="text-error hover:text-error"
                >
                  <Trash2 className="size-[16px]" aria-hidden="true" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      )}

      {editingPost && (
        <Modal
          open={!!editingPost}
          onOpenChange={(open) => !open && setEditingPost(null)}
          title={isNew ? "New Blog Post" : `Edit — ${editingPost.title}`}
          className="max-w-2xl"
        >
          <BlogEditForm post={editingPost} onSave={handleSave} onCancel={() => setEditingPost(null)} />
        </Modal>
      )}
    </>
  );
}

function BlogEditForm({
  post,
  onSave,
  onCancel,
}: {
  post: BlogPost;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = React.useState(post);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...form, slug: form.slug || slugify(form.title) });
      }}
      className="grid max-h-[70vh] gap-4 overflow-y-auto pr-1"
    >
      <div className="grid gap-2">
        <Label htmlFor="blog-title">Title</Label>
        <Input id="blog-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="blog-category">Category</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as BlogPost["category"] })}>
            <SelectTrigger id="blog-category"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(categoryLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="blog-author">Author</Label>
          <Select value={form.authorId} onValueChange={(v) => setForm({ ...form, authorId: v })}>
            <SelectTrigger id="blog-author"><SelectValue /></SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="blog-excerpt">Excerpt</Label>
        <Textarea id="blog-excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="blog-content">Body (one paragraph per line)</Label>
        <Textarea
          id="blog-content"
          rows={8}
          value={form.content.join("\n")}
          onChange={(e) => setForm({ ...form, content: e.target.value.split("\n").filter(Boolean) })}
        />
      </div>

      <div className="flex items-center justify-between rounded-input border border-border p-3">
        <div>
          <p className="text-body font-medium text-neutral-900">Published</p>
          <p className="text-caption text-neutral-600">Toggle off to keep this as a draft.</p>
        </div>
        <Switch
          checked={form.status === "Published"}
          onCheckedChange={(checked) => setForm({ ...form, status: checked ? "Published" : "Draft" })}
          aria-label="Published status"
        />
      </div>

      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Post</Button>
      </div>
    </form>
  );
}
