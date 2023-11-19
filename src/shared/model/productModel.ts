
export interface Product {
    id?: string;
    desc: string;
    sku_max_quantity?: string;
    pack_desc?: string;
    sort_index_pos?: number;
    cart_count?: number;
    is_best_value?: boolean;
    weight: string;
    absolute_url?: string;
    usp: string;
    availability?: Availability;
    pricing: Pricing;
    images?: Image[];
    variableWeight?: string;
    brand: Brand;
    category: Category;
    children?: Product[];
    rating_info?: RatingInfo;
    additional_info?: AdditionalInfo;
    parent_info?: ParentInfo;
  }
  
  export interface Availability {
    avail_status: string;
    display_mrp: boolean;
    display_sp: boolean;
    not_for_sale: boolean;
    button: string;
    show_express: boolean;
  }
  
  export interface Pricing {
    discount: Discount;
    offer?: Offer;
  }
  
  export interface Discount {
    mrp: string;
    d_text: string;
    d_avail: string;
    offer_entry_text: string;
    subscription_price: string;
    offer_available: string;
  }
  
  export interface Offer {
    campaign_type_slug: string;
    offer_logo_web: boolean;
    arrow_image: string;
    offer_available: string;
    campaign_type: string;
    offer_logo: string;
    offer_logo_big: string;
    text_color: string;
    offer_logo_small: string;
    offer_ent_txt: string;
    offer_entry_text: string;
  }
  
  export interface Image {
    s: string;
    m: string;
  }
  export interface Brand {
    name: string;
    slug: string;
    url: string;
  }
  export interface Category {
    tlc_name: string;
    tlc_slug: string;
    mlc_name: string;
    mlc_slug: string;
    mlc_id: number;
    llc_name: string;
    llc_slug: string;
    llc_id: number;
  }
  export interface RatingInfo {
    avg_rating: string;
    rating_count: number;
    review_count: number;
    sku_id: number;
    order_count: number;
    member_count: number;
  }
  
  export interface AdditionalInfo {
    other_app_pd: boolean;
    per_unit_pd_page: boolean;
    other_app_listing: boolean;
    per_unit_listing_page: boolean;
    per_unit_pack_selector: boolean;
  }
  export interface ParentInfo {
    id: number;
    parent_product_id: number;
    child_product_id: number;
    order: number;
    parent_id: number;
    child_id: number;
    is_default: number;
    type: number;
    created_by_id: number;
    updated_by_id: number;
    created_on: string;
    updated_on: string;
  }
  
  export interface CategoryOfTree {
    id: number;
    name: string;
    slug: string;
    url: string;
    level: number;
    bannersList: Banner[];
    children: CategoryOfTree[];
    dest_type: string;
    dest_slug: string;
    type: string;
  }
  
  export interface Banner {
    id: number;
    url: string;
    campaign: string;
    orientation: string;
    image_name: string;
    mobile_destination_type: string;
    pwa_url: string;
    banner_sec_id: string;
    mobile_destination_slug: string;
    banner_type: string;
  }