
import { Badge } from "@/components/ui/badge";
import { getIconForCategory } from "@/utils/categoryIcons";
import { 
  CreditCard, ShoppingBag, Home, Car, Film, 
  Plug, Heart, Plane, Book, User, ShoppingCart, 
  TrendingUp, Briefcase, Gift, Circle, Utensils 
} from "lucide-react";

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  // Map category to icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "utensils": return <Utensils className="h-3 w-3 mr-1" />;
      case "home": return <Home className="h-3 w-3 mr-1" />;
      case "car": return <Car className="h-3 w-3 mr-1" />;
      case "film": return <Film className="h-3 w-3 mr-1" />;
      case "shopping-bag": return <ShoppingBag className="h-3 w-3 mr-1" />;
      case "plug": return <Plug className="h-3 w-3 mr-1" />;
      case "heart": return <Heart className="h-3 w-3 mr-1" />;
      case "plane": return <Plane className="h-3 w-3 mr-1" />;
      case "book": return <Book className="h-3 w-3 mr-1" />;
      case "user": return <User className="h-3 w-3 mr-1" />;
      case "shopping-cart": return <ShoppingCart className="h-3 w-3 mr-1" />;
      case "trending-up": return <TrendingUp className="h-3 w-3 mr-1" />;
      case "credit-card": return <CreditCard className="h-3 w-3 mr-1" />;
      case "briefcase": return <Briefcase className="h-3 w-3 mr-1" />;
      case "gift": return <Gift className="h-3 w-3 mr-1" />;
      case "circle":
      default: return <Circle className="h-3 w-3 mr-1" />;
    }
  };

  const iconName = getIconForCategory(category);
  const IconComponent = getIconComponent(iconName);

  return (
    <Badge variant="outline" className={`flex items-center text-xs font-normal ${className}`}>
      {IconComponent}
      {category}
    </Badge>
  );
}
