import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from 'app/common-service.service';
import { Router } from '@angular/router';
import { tender, activeTender4tenderer, viewAllBidders } from 'app/login-user.model';

@Component({
  selector: 'app-project-engineer-dashboard',
  templateUrl: './project-engineer-dashboard.component.html',
  styleUrls: ['./project-engineer-dashboard.component.css']
})
export class ProjectEngineerDashboardComponent implements OnInit {
  tenders:tender[];
  public count:number;
  public tender_id=null;
  tenderDetailData2:any=[];
  activetendersData:activeTender4tenderer[];
  public tenderIdtoVewBidders=null
  viewAllBidders:viewAllBidders[]
  constructor(
    private service:CommonServiceService,
    private router:Router
    ) {
   }

  ngOnInit(): void {
    this.getTenders();
    // this.viewTenderDetails();
    this.getActiveTenders4tenderer();
    this.viewAllBidders4PE();
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
    this.router.navigate(['/view_tender_details'])
  }
  viewTenderDetails(){
    this.service.viewTenderDetails().subscribe(data=>{
        // this.tenderDetailData=data;
        this.tenderDetailData2.push(data);       
    })
  }
  getActiveTenders4tenderer(){
    return this.service.getActiveTenders4tenderer().subscribe(data=>{
      this.activetendersData=data;
    })
  }
  gotoViewBidders(tenderid:activeTender4tenderer){
    this.tenderIdtoVewBidders=tenderid
    this.service.TenderIdforAppliedBidders=this.tenderIdtoVewBidders
    // alert(this.service.TenderIdforAcceptance)
    // this.service.TenderIdforAppliedBidders=this.tenderIdtoVewBidders
    this.router.navigate(['/view_applied_bidders'])
    // alert(this.service.TenderIdforAppliedBidders)
  }
  // more(ten:tender){
  //   this.tender_id=ten
  //   this.service.TenderIdforAllDetails=this.tender_id
  //   // alert(this.service.TenderIdforAllDetails)
  //   this.router.navigate(['/view_details'])
  // }
  viewAllBidders4PE(){
    return this.service.viewAllBidders4PE().subscribe(data=>{
      this.viewAllBidders=data;
    })
  }
}
