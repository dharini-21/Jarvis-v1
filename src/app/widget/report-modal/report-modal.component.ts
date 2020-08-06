import { Component, OnInit, Inject } from '@angular/core';
import { WidgetComponent } from '../widget.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import {saveAs} from 'file-saver';

import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.component.html',
  styleUrls: ['./report-modal.component.css']
})
export class ReportModalComponent implements OnInit {

  url:any;
  constructor(public dialogRef: MatDialogRef<WidgetComponent>,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: any,private http:HttpClient) { }
  resizedataURL(datas, wantedWidth, wantedHeight){
    return new Promise(async function(resolve,reject){

        // We create an image to receive the Data URI
        var img = document.createElement('img');

        // When the event "onload" is triggered we can resize the image.
        img.onload = function()
        {        
            // We create a canvas and get its context.
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            // We set the dimensions at the wanted size.
            canvas.width = wantedWidth;
            canvas.height = wantedHeight;

            // We resize the image with the canvas method drawImage();
            ctx.drawImage(img, 0, 0, wantedWidth, wantedHeight);

            var dataURI = canvas.toDataURL();

            // This is the return of the Promise
            resolve(dataURI);
        };

        // We put the Data URI in the image's src attribute
        img.src = datas;

    })
}
  async ngOnInit() {
    console.log(this.data.imageUrl)
    this.url = await this.resizedataURL(this.data.imageUrl,900,500)    
  }

  blobToDataURL(blob: Blob) {
    return new Promise((resolve) =>
    {
    var a = new FileReader();
    a.onload = ()=>  {resolve(a.result)}
    a.readAsDataURL(blob);
    })
}

  async save($event){
    let fromMail = ''
    let toMail = ''
    let senderPass = ''
    let subject = `report from user`
    let title = 'report.png'
    let text = `Greetings, Got a report from user\n`
    console.log($event)
  var url :string
   url = <string> await this.blobToDataURL($event)
   console.log(url)
   var byteString;
    if (url.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(url.split(',')[1]);
    else
        byteString = unescape(url.split(',')[1]);

    // separate out the mime component
    var mimeString = url.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    let blob= new Blob([ia], {type:mimeString});
    let formData = new FormData();
    console.log(blob)
    formData.append('file', blob);
    formData.append("fromMail",fromMail)
    formData.append("toMail",toMail)
    formData.append("subject",subject)
    formData.append("text",text)
    formData.append("senderPass",senderPass)
    formData.append("title",title)
    
    this.http.post(`http://localhost:3000/reportbug`,formData).subscribe(res=>{
      console.log(res)
      this.dialogRef.close("Mail Sent");
    },err=>{
      console.log(err);
      this.dialogRef.close("Unable To Send Mail");
    })
    
  }
  cancel(){
    this.dialogRef.close();
  }

}
