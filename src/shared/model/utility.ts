// export const SERVER_API_BASE_URL = 'http://localhost:9090';
export const SERVER_API_BASE_URL = 'https://vatana-server.up.railway.app';

export interface DialogData {
  title: string;
  message: string[];
  dangerButton?: string;
  neutralButton?: string;
  successButton?: string;
}

export interface ProductTabViewOptions{
  sectionTitle: boolean;
  shopOptions: boolean;
  pagination: boolean;
  filterOptions: boolean;
}

export interface Review{
  reviewId?: string;
  productId: string;
  userId: string;
  userName: string;
  reviewTitle: string;
  reviewMessage: string;
  reviewRating: number;
  reviewTime: Date;
}

export interface Pagination {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  total: number;
}

export interface Page<T> {
  content: T;
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface UserAndProduct {
  userId: string;
  productId: string
}