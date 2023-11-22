import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryOfTree, Product } from 'src/shared/model/productModel';
import { ProductService } from 'src/shared/services/product/product.service';

@Component({
  selector: 'admin-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent implements OnInit, OnDestroy{
  product: Product;
  subscriptions: Subscription[] = [];
  topCategoryTree!: CategoryOfTree[];
  midCategoryTree!: CategoryOfTree[];
  lowCategoryTree!: CategoryOfTree[];
  addProductForm: FormGroup = new FormGroup({});
  isAddingProduct = false;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.addProductForm = this.fb.group({
      productName: this.fb.control('', [Validators.required]),
      brandName: this.fb.control('', [Validators.required]),
      price: this.fb.control('', [Validators.required]),
      tlc: this.fb.control('', [Validators.required]),
      mlc: this.fb.control('', [Validators.required]),
      llc: this.fb.control('', [Validators.required]),
      productUsp: this.fb.control('', [Validators.required]),
      weight: this.fb.control('', [Validators.required]),
    });
    this.getProduct();
    // this.initNewProduct();
    this.getCategoryTree();
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * @function getProduct: function to get the active product
   */
  getProduct() {
    const sub = this.activeRoute.params.subscribe({
      next: (param) => {
        const productId = param['id'];
        const innerSub = this.productService.getProductById(productId).subscribe({
          next: (res) => {
            this.product = res.data;
            this.initForm();
            this.productCategoryFormSub();
          }, error: (er) => {
            console.error(er);
          }
        });
        this.subscriptions.push(innerSub);
      }
    });

    this.subscriptions.push(sub);
  }

  /**
   * @function getCategoryTree: function to get the products category tree
   */
  getCategoryTree() {
    const sub = this.productService.getCategoryTree().subscribe({
      next: (res) => {
        this.topCategoryTree = res.data;
      },
    });
    this.subscriptions.push(sub);
  }

  /**
   * @function initForm: funcion to initialze the forms
   */
  initForm() {
    this.addProductForm = this.fb.group({
      productName: this.fb.control(this.product.desc, [Validators.required]),
      brandName: this.fb.control(this.product.brand.name, [Validators.required]),
      price: this.fb.control(this.product.pricing.discount.mrp, [Validators.required]),
      tlc: this.fb.control(this.product.category.tlc_name, [Validators.required]),
      mlc: this.fb.control(this.product.category.mlc_name, [Validators.required]),
      llc: this.fb.control(this.product.category.llc_name, [Validators.required]),
      productUsp: this.fb.control(this.product.usp, [Validators.required]),
      weight: this.fb.control(this.product.weight, [Validators.required]),
    });
  }

  /**
   * @function handleSubmit: function to handle the updation of products
   */
  handleSubmit() {
    this.isAddingProduct = true;
    if (this.addProductForm.valid) {
      const formValue = this.addProductForm.value;
      this.product.desc = formValue.productName;
      this.product.pricing.discount.mrp = formValue.price;
      this.product.brand.name = formValue.brandName;
      this.product.usp = formValue.productUsp;
      this.product.weight = formValue.weight;
      const image = {
        s: formValue.imageURL,
        m: formValue.imageURL,
      };
      this.product.images?.push(image);

      const sub = this.productService.updateProduct(this.product, this.product.id).subscribe({
        next: (res) => {
          let message = 'Failed ot Update Product';
          let action = 'Try Later';
          if (res.success) {
            message = 'Product has been updated Successfully!!';
            action = 'Yayy!!';
          }
          this.snackBar.open(message, action, {
            duration: 3000,
          });
          this.router.navigate(['/admin/products']);
        },
      });
      this.subscriptions.push(sub);
    }
  }

  /**
   * @function handleCancel: fucntion to handle the cancellation of update products
   */
  handleCancel() {
    this.addProductForm.reset();
    this.router.navigate(['/admin/products']);
  }

  /**
   * @function initNewProduct: function to initialize a new product
   */
  initNewProduct() {
    this.product = {
      desc: '',
      sku_max_quantity: '',
      pack_desc: '',
      sort_index_pos: 0,
      cart_count: 0,
      is_best_value: false,
      weight: '',
      absolute_url: '',
      usp: '',
      availability: undefined,
      pricing: {
        discount: {
          mrp: '',
          d_text: '',
          d_avail: '',
          offer_entry_text: '',
          subscription_price: '',
          offer_available: '',
        },
        offer: {
          campaign_type_slug: '',
          offer_logo_web: false,
          arrow_image: '',
          offer_available: '',
          campaign_type: '',
          offer_logo: '',
          offer_logo_big: '',
          text_color: '',
          offer_logo_small: '',
          offer_ent_txt: '',
          offer_entry_text: '',
        },
      },
      images: [],
      variableWeight: '',
      brand: {
        name: '',
        slug: '',
        url: '',
      },
      category: {
        tlc_name: '',
        tlc_slug: '',
        llc_id: 0,
        llc_name: '',
        llc_slug: '',
        mlc_id: 0,
        mlc_name: '',
        mlc_slug: '',
      },
      children: [],
      rating_info: {
        avg_rating: '',
        rating_count: 0,
        review_count: 0,
        sku_id: 0,
        order_count: 0,
        member_count: 0,
      },
      additional_info: {
        other_app_pd: false,
        per_unit_pd_page: false,
        other_app_listing: false,
        per_unit_listing_page: false,
        per_unit_pack_selector: false,
      },
      parent_info: {
        id: 0,
        parent_product_id: 0,
        child_product_id: 0,
        order: 0,
        parent_id: 0,
        child_id: 0,
        is_default: 0,
        type: 0,
        created_by_id: 0,
        updated_by_id: 0,
        created_on: '',
        updated_on: '',
      },
    };
  }

  /**
   * @function productCategoryFormSub: function to subscribe to the product category form value changes
   */
  productCategoryFormSub() {
    // something changes in tlc
    const sub1 = this.addProductForm.controls['tlc'].valueChanges.subscribe({
      next: (data) => {
        // reset mlc and llc form controls
        this.addProductForm.controls['mlc'].reset();
        this.addProductForm.controls['llc'].reset();

        // get the specific category
        const sub2 = this.productService.getCategoryById(data).subscribe({
          next: (res) => {
            // assigning tlc slug and name values
            this.product.category.tlc_slug = res.data.slug;
            this.product.category.tlc_name = res.data.name;

            // found midCategory tree
            this.midCategoryTree = res.data.children;

            // something changes in mlc
            const sub3 = this.addProductForm.controls['mlc'].valueChanges.subscribe({
              next: (childData) => {
                // reset llc form
                this.addProductForm.controls['llc'].reset();

                //find mid level specific category
                const mlcChild = this.midCategoryTree.find(
                  (ele) => ele.id == childData
                );

                // assign mlc id, name, slug
                this.product.category.mlc_id = childData;
                this.product.category.mlc_name = mlcChild.name;
                this.product.category.mlc_slug = mlcChild.slug;

                // assign value to lowCategoryTree
                if (mlcChild) {
                  this.lowCategoryTree = mlcChild.children;
                } else {
                  this.lowCategoryTree = [];
                }

                // if something changes in llc
                const sub4 = this.addProductForm.controls['llc'].valueChanges.subscribe({
                  next: (grandChild) => {
                    // find the specific chosen tlc
                    const llcChild = this.lowCategoryTree.find(
                      (ele) => ele.id == grandChild
                    );

                    // assign llc id, name, slug
                    this.product.category.llc_id = grandChild;
                    this.product.category.llc_name = llcChild.name;
                    this.product.category.llc_slug = llcChild.slug;
                  },
                });
                this.subscriptions.push(sub4);
              },
            });
            this.subscriptions.push(sub3);
          },
        });
        this.subscriptions.push(sub2);
      },
    });

    this.subscriptions.push(sub1);
  }
}
