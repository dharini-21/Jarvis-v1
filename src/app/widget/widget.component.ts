import { Component, OnInit, Input } from '@angular/core';
import {NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedbackModalComponent } from './feedback-modal/feedback-modal.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import html2canvas from "html2canvas";
import {saveAs} from "file-saver";
import { ReportModalComponent } from './report-modal/report-modal.component';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {

  @Input() url:string;
  constructor(private modalService: NgbModal,public dialog: MatDialog) { }

  ngOnInit() {
  }

  navigateTo(){
    window.open(this.url);
  }
  
  openFeedbackWindow(){
    
    const dialogRef = this.dialog.open(FeedbackModalComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }


async openReportWindow(){
    let imageBlob:any;
    let url:string;
    let options = {x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
      logging: true}
    await html2canvas(document.getElementById("Page"),options).then(function(canvas) {
      url = canvas.toDataURL('png')
      
      canvas.toBlob(function(blob){
          let link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          imageBlob = blob
      },'image/png');
  });
  console.log(url)
  const dialogRef = this.dialog.open(ReportModalComponent, {
    width: '1500px',
    height:'800px',
    disableClose: true,
    data:{
      imageBlob: imageBlob,
      imageUrl: url
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
  });
  }

}
