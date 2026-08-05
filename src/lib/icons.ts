import {
  Code2,
  Globe,
  ShoppingCart,
  Smartphone,
  PenTool,
  Bot,
  Cloud,
  Database,
  Lightbulb,
  LifeBuoy,
  ShoppingBag,
  HeartPulse,
  Building2,
  Truck,
  GraduationCap,
  Landmark,
  Plane,
  Factory,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps each fixed service/industry slug (src/config/site.ts) to its
 * icon. Kept separate from site.ts so that file stays framework-
 * agnostic (safe to reuse in the Admin Dashboard/CMS layer later),
 * while this file is presentation-only.
 */
export const serviceIcons: Record<string, LucideIcon> = {
  "custom-software-development": Code2,
  "website-design-development": Globe,
  "ecommerce-development": ShoppingCart,
  "mobile-app-development": Smartphone,
  "ui-ux-design": PenTool,
  "ai-automation": Bot,
  "cloud-solutions-api-integration": Cloud,
  "erp-crm-development": Database,
  "it-consulting-digital-transformation": Lightbulb,
  "maintenance-technical-support": LifeBuoy,
};

export const industryIcons: Record<string, LucideIcon> = {
  "ecommerce-retail": ShoppingBag,
  healthcare: HeartPulse,
  "real-estate": Building2,
  "logistics-supply-chain": Truck,
  education: GraduationCap,
  "finance-fintech": Landmark,
  "travel-hospitality": Plane,
  manufacturing: Factory,
  "professional-services": Briefcase,
};
