import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import { from } from 'rxjs';
import { CommonServiceService } from 'app/common-service.service';
import { tender, applied_tenders } from '../login-user.model';
 
@Component({
  selector: 'app-bidder-dashboard',
  templateUrl: './bidder-dashboard.component.html',
  styleUrls: ['./bidder-dashboard.component.css']
})
export class BidderDashboardComponent implements OnInit
{
  tenders:tender[];
  getappliedTenders:applied_tenders[];

  public tender_id=null;
  constructor(private router:Router,
    private service:CommonServiceService) { }
 
  ngOnInit(): void {
    this.getTenders();
  }
  // gotoAllTenders()
  // {
  //   console.log("Calling AllTenders");
  //   this.router.navigate(['/alltenders']);
  // }
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
    // alert(this.service.referenceNoforTechnical)
    this.router.navigate(['/technical_details_bid'])
  }
  viewAppliedTenders4Bidder(){
    return this.service.viewAppliedTenders().subscribe(
      (data:applied_tenders[])=>{
        this.getappliedTenders=data;
      }
    )
  }
}
 
