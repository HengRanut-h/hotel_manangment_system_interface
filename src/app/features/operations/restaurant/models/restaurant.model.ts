export interface MenuCategory {
  id: string;
  hotelId?: string;
  name: string;
  isActive: boolean;
  createdAtUtc?: string;
  items?: MenuItem[];
}

export interface MenuItem {
  id: string;
  hotelId?: string;
  categoryId: string;
  categoryName?: string | null;
  name: string;
  price: number;
  isAvailable: boolean;
  createdAtUtc?: string;
}

export interface RestaurantMenu {
  categories: MenuCategory[];
  items: MenuItem[];
}

export interface RestaurantOrder {
  id: string;
  hotelId?: string;
  branchId?: string | null;
  orderNumber: string;
  roomId: string | null;
  guestId: string | null;
  status: string;
  createdAtUtc?: string;
}

export interface RestaurantOrderItem {
  id?: string;
  orderId?: string;
  menuItemId: string;
  quantity: number;
  unitPrice?: number;
  createdAtUtc?: string;
}

export interface CreateMenuCategoryRequest {
  name: string;
}

export interface CreateMenuItemRequest {
  categoryId: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface CreateRestaurantOrderRequest {
  roomId?: string | null;
  guestId?: string | null;
}

export interface AddRestaurantOrderItemRequest {
  menuItemId: string;
  quantity: number;
}

export interface PosCartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface CreatedOrderResult {
  order: RestaurantOrder;
  addedItems: number;
  failedItems: PosCartItem[];
}

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  code?: string | null;
  errors?: Record<string, string[]> | null;
  traceId?: string | null;
}
