import { Component,Inject,Input,Output, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { WidgetComponent } from '../widget.component';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { SendMailComponent } from 'src/app/send-mail/send-mail.component';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.css']
})


export class FeedbackModalComponent implements OnInit {

  closeResult: string;

  private rating: any = 0;
  private starCount: number = 5;
  private color: string = 'accent';
  private ratingArr:number[] = [];
  private commentArr:string[] = ['Poor','More to Improve','Not Bad','Good','Awesome']
  private emailId:string;
  private comments:string;
  private datau:string = "";
  private showMatProgress:boolean = false;

ngOnInit() {
  this.showMatProgress = false;
  this.rating=0;
  this.comments="";
  this.emailId="";
    console.log("a "+this.starCount)
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }
   onClick(rating:number) {
    console.log(rating)
    this.rating = rating;
    
   }

   comment(index: number){
     return(this.commentArr[index])
   }

   showIcon(index:number) {
    if(this.rating<=2 && this.rating!=0){
      this.color='warn';
    } else{
      this.color='accent'
    }
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  constructor(
    public dialogRef: MatDialogRef<WidgetComponent>,private http: HttpClient,private dialog: MatDialog) {}

  closeClick(): void {
    this.dialogRef.close();
  }

  submitFeedback(): any {
    const dialogRef = this.dialog.open(SendMailComponent, {
      width: '600px',
      disableClose: true,
      data:{
        emailId:this.emailId,
        rating:this.rating,
        comments:this.comments
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result == "Mail Sent"){
        console.log(result);
        Swal.fire(
          'Mail Sent',
          "Mail Sent to Product Support Team",
          'success'
        )
        this.dialogRef.close();
      } else{
        console.log(result);
        Swal.fire(
          'Mail Not Sent',
          "Unable to connect to Product Support Team",
          'error'
        )
      }
      
    });
    
  }

}
