import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CategoryOfTree, Product } from 'src/shared/model/productModel';
import { ProductService } from 'src/shared/services/product/product.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'admin-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  topCategoryTree!: CategoryOfTree[];
  midCategoryTree!: CategoryOfTree[];
  lowCategoryTree!: CategoryOfTree[];
  addProductForm: FormGroup = new FormGroup({});
  isAddingProduct = false;

  newProduct!: Product;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initNewProduct();
    this.getCategoryTree();
    this.addProductFormSub();
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(sub => sub.unsubscribe());
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
   * @function initForm: function to initialize forms
   */
  initForm() {
    this.addProductForm = this.fb.group({
      productName: this.fb.control('', [Validators.required]),
      brandName: this.fb.control('', [Validators.required]),
      price: this.fb.control('', [Validators.required]),
      tlc: this.fb.control('', [Validators.required]),
      mlc: this.fb.control('', [Validators.required]),
      llc: this.fb.control('', [Validators.required]),
      productUsp: this.fb.control('', [Validators.required]),
      weight: this.fb.control('', [Validators.required]),
      imageURL: this.fb.control('', [Validators.required]),
    });
  }

  /**
   * @function handleSubmit: function to handle product addition
   */
  handleSubmit() {
    this.isAddingProduct = true;
    if (this.addProductForm.valid) {
      const formValue = this.addProductForm.value;
      this.newProduct.desc = formValue.productName;
      this.newProduct.pricing.discount.mrp = formValue.price;
      this.newProduct.brand.name = formValue.brandName;
      this.newProduct.usp = formValue.productUsp;
      this.newProduct.weight = formValue.weight;
      const image = {
        s: formValue.imageURL,
        m: formValue.imageURL,
      };
      this.newProduct.images?.push(image);

      const sub = this.productService.addProduct(this.newProduct).subscribe({
        next: (res) => {
          let message = 'Failed ot Add Product';
          let action = 'Try Later';
          if (res.success) {
            message = 'Product has been added Successfully!!';
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
   * @function handleCancel: function to handle cancellation of product addition
   */
  handleCancel() {
    this.addProductForm.reset();
    this.router.navigate(['/admin/products']);
  }

  /**
   * @function initNewProduct: function to initialize a new product
   */
  initNewProduct() {
    this.newProduct = {
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
   * @function addProductFormSub: function to subscribe to the addProductForm value changes
   */
  addProductFormSub() {
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
            this.newProduct.category.tlc_slug = res.data.slug;
            this.newProduct.category.tlc_name = res.data.name;

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
                this.newProduct.category.mlc_id = childData;
                this.newProduct.category.mlc_name = mlcChild.name;
                this.newProduct.category.mlc_slug = mlcChild.slug;

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
                    this.newProduct.category.llc_id = grandChild;
                    this.newProduct.category.llc_name = llcChild.name;
                    this.newProduct.category.llc_slug = llcChild.slug;
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
