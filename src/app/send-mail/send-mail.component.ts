import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { FeedbackModalComponent } from '../widget/feedback-modal/feedback-modal.component';
@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.css']
})
export class SendMailComponent implements OnInit {
  showBar:boolean;
  constructor(public dialogRef: MatDialogRef<FeedbackModalComponent>,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,private http:HttpClient) { }

  ngOnInit() {
    let fromMail = ''
    let toMail = ''
    let senderPass = ''
    let subject = `Feedback from user ${this.data.emailId}`
    let title = 'feedback.jpeg'
    let text = `Greetings, Got a feedback from user ${this.data.emailId}\n`
    if(this.data.comments.length==0){
      text += `Rating : ${this.data.rating}`
    }else{
      text += `Comments : ${this.data.comments}\n`
      text += `Rating : ${this.data.rating}`
    }
    this.showBar=true;
    this.http.post(`http://localhost:3000/send`,{"fromMail":fromMail,"toMail":toMail,"subject":subject,"text":text,"senderPass":senderPass,"title":title}).subscribe(res=>{
        console.log(res)
        this.dialogRef.close("Mail Sent");
      },err=>{
        console.log(err);
        this.dialogRef.close("Unable To Send Mail");
      })

  }

}
