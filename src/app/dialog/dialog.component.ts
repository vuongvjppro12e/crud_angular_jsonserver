import { Component, OnInit,Inject } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef,MAT_DIALOG_DATA} from "@angular/material/dialog";
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  freshnesslist = ["Brand new","Second hand","Refurbished"]
  productForm !: FormGroup;
  actionBtn : string="Save"
  title : String="create new product"
  constructor(private formBuider : FormBuilder,
    private api : ApiService,
    @Inject(MAT_DIALOG_DATA) public editdata : any,
    private dialogref : MatDialogRef<DialogComponent> ) { }

  ngOnInit(): void {
    this.productForm =this.formBuider.group({
      productName : ['',Validators.required],
      category : ['',Validators.required],
      freshness : ['',Validators.required],
      price: ['',Validators.required],
      comment : ['',Validators.required],
      date : ['',Validators.required]
    });
    console.log(this.editdata);
    if(this.editdata){
      this.actionBtn="Update";
      this.title="Update product";
      this.productForm.controls['productName'].setValue(this.editdata.productName);
      this.productForm.controls['category'].setValue(this.editdata.category);
      this.productForm.controls['freshness'].setValue(this.editdata.freshness);
      this.productForm.controls['price'].setValue(this.editdata.price);
      this.productForm.controls['comment'].setValue(this.editdata.comment);
      this.productForm.controls['date'].setValue(this.editdata.date);
    }
  }
  addProduct(){
    if(!this.editdata){
      if(this.productForm.valid){
        console.log(this.productForm.value);
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res)=>{
            alert("product added successfully !!");
            this.productForm.reset();
            this.dialogref.close('save');
          },
          error:()=>{
            alert("error while adding product !!");
          }
        })
      }
    }else{
      this.updateProduct()
    }
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editdata.id)
    .subscribe({
      next:(res)=>{
        alert("Product updated successfully !!")
        this.productForm.reset();
        this.dialogref.close('update');
      },
      error:()=>{
        alert("error while recording !");
      }
    })
  }
}
