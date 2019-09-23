import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductModel } from '../_models/product.Model';
import { ProductsService } from '../_services/products.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogModel, ConfirmDialogeComponent } from '../confirm-dialoge/confirm-dialoge.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-admin-list-products',
  templateUrl: './admin-list-products.component.html',
  styles: []
})
export class AdminListProductsComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  products: MatTableDataSource<ProductModel>;
  displayedColumns: string[] = ['name', 'start_time', 'end_time', 'description', 'actions'];

  constructor(private productService: ProductsService, private router: Router, public dialog: MatDialog) {

  }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.productService.getAllProducts().subscribe(data => {
      this.products = new MatTableDataSource(data['products']);
      this.products.sort = this.sort;
      this.products.paginator = this.paginator;
    });
  };

  applyFilter(filterValue: string) {
    this.products.filter = filterValue.trim().toLowerCase();

    if (this.products.paginator) {
      this.products.paginator.firstPage();
    }
  }


  addProduct(): void {
    this.router.navigate(['add-product']);
  }

  private deleteProduct(product: ProductModel) {
    this.productService.deleteProduct(product._id).subscribe(data => {
      this.getAllProducts();
    });
  }

  updateProduct(product: ProductModel) {
    localStorage.removeItem("productId");
    localStorage.setItem("productId", product._id);
    this.router.navigate(['edit-product']);
  }

  confirmDialog(product: ProductModel): void {
    const message = `Are you sure you want to delete this product?`;

    const dialogData = new ConfirmDialogModel("Confirm Delete", message);

    const dialogRef = this.dialog.open(ConfirmDialogeComponent,
      {
        maxWidth: "400px",
        data: dialogData
      });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == 'true') {
        this.deleteProduct(product);
      }
    });
  }
}
