import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import type { Item } from '../types';
import { Card, Badge, Avatar } from './UI';
import { formatCurrency, formatDate } from '../utils/helpers';

interface ItemCardProps {
  item: Item;
}

export const ItemCard = ({ item }: ItemCardProps) => {
  const navigate = useNavigate();

  const primaryImage = item.images?.find((img) => img.is_primary) || item.images?.[0];

  return (
    <Card onClick={() => navigate(`/items/${item.id}`)} className="overflow-hidden p-0">
      <div className="aspect-video bg-gray-200 relative">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        {!item.is_available && (
          <div className="absolute top-2 right-2">
            <Badge variant="danger">Unavailable</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
          <Badge variant="info">{item.condition.replace('_', ' ')}</Badge>
        </div>
        {item.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.description}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(item.created_at)}
          </span>
          {item.category && (
            <Badge variant="default">{item.category}</Badge>
          )}
        </div>
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center space-x-2">
            <Avatar
              src={item.owner?.avatar_url}
              alt={item.owner?.full_name || 'Owner'}
              size="sm"
              fallback={item.owner?.full_name?.charAt(0)}
            />
            <span className="text-sm font-medium">{item.owner?.full_name || 'Unknown'}</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Deposit</p>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(item.deposit_amount)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
