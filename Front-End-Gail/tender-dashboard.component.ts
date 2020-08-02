import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'app/common-service.service';
import { tender, activeTender4tenderer } from 'app/login-user.model';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-tender-dashboard',
  templateUrl: './tender-dashboard.component.html',
  styleUrls: ['./tender-dashboard.component.css']
})
export class TenderDashboardComponent implements OnInit {
  tenderRegisteredData:tender[];
  activetendersData:activeTender4tenderer[];
  tenders:tender[];
  public count:number;
  public tender_id=null;
  public loginId4UpdateTender:String;
  constructor(private service:CommonServiceService,private router:Router) { }
 
  ngOnInit(): void
  {
    this.getTenders();
    this.getActiveTenders4tenderer()
  }
  getTenders(){
    this.service.getAllTenders4Bidder().subscribe(
      (data:tender[])=>{
        this.tenders=data;
    })
  }
  
  more(ten:tender)
  {
    this.tender_id=ten
    this.service.referenceNoforTechnical=this.tender_id
    // alert(this.service.TenderIdforAllDetails)
    this.router.navigate(['/view_details'])
  }
 
  getRegisteredTenders(){
    return this.service.getRegisteredTenders().subscribe(data=>{
      this.tenderRegisteredData=data;
    })
  }
  getActiveTenders4tenderer(){
    return this.service.getActiveTenders4tenderer().subscribe(data=>{
      this.activetendersData=data;
    })
  }
}
