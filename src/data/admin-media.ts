export type MediaItem = {
  id: string;
  filename: string;
  src: string;
  usedIn: string;
};

/**
 * Media Library listing — reflects the actual image assets currently
 * committed to public/images/. Once Cloudinary is wired up (backend
 * phase), this becomes a real fetch of uploaded assets instead of a
 * hardcoded list, but the shape (filename, src, usedIn) stays the same.
 */
export const mediaItems: MediaItem[] = [
  { id: "logo", filename: "logo.png", src: "/images/logo.png", usedIn: "Header, Footer, Favicon" },
  { id: "ecommerce-placeholder", filename: "ecommerce-placeholder.jpg", src: "/images/portfolio/ecommerce-placeholder.jpg", usedIn: "Portfolio: E-commerce Platform Modernization" },
  { id: "automation-placeholder", filename: "automation-placeholder.jpg", src: "/images/portfolio/automation-placeholder.jpg", usedIn: "Portfolio: Operations Workflow Automation" },
  { id: "crm-placeholder", filename: "crm-placeholder.jpg", src: "/images/portfolio/crm-placeholder.jpg", usedIn: "Portfolio: Custom CRM for a Growing Real Estate Team" },
  { id: "software-signs-blog", filename: "software-signs-blog.jpg", src: "/images/blog/software-signs-blog.jpg", usedIn: "Blog: 5 Signs Your Business Has Outgrown..." },
  { id: "automation-blog", filename: "automation-blog.jpg", src: "/images/blog/automation-blog.jpg", usedIn: "Blog: What to Automate First" },
  { id: "process-blog", filename: "process-blog.jpg", src: "/images/blog/process-blog.jpg", usedIn: "Blog: How to Evaluate a Software Development Partner" },
  { id: "team-fc", filename: "fc.jpg", src: "/images/team/fc.jpg", usedIn: "Team: Founder & CEO" },
  { id: "team-pm", filename: "pm.jpg", src: "/images/team/pm.jpg", usedIn: "Team: Project Manager" },
  { id: "team-om", filename: "om.jpg", src: "/images/team/om.jpg", usedIn: "Team: Operations Manager" },
  { id: "team-bd", filename: "bd.jpg", src: "/images/team/bd.jpg", usedIn: "Team: Business Development Manager" },
  { id: "team-fa", filename: "fa.jpg", src: "/images/team/fa.jpg", usedIn: "Team: Finance & Accounts Manager" },
];
