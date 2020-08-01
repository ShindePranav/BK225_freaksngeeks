pragma solidity >= 0.5.0 < 0.7.0;

contract AcceptBid  {
    
  address public manager;
    
  struct BidDetails{
        //unique identifier
        uint bidId;
        //Tender Details with time 
        uint tenderRefNo;
        string tenderName;
        uint bidSubmissionOpeningDate;
        uint bidSubmissionClosingDate;
        //Bid details 
        uint bidderId;
        string bidderName;
        uint biddingDate;
        uint bidAmount;
  }
     
  mapping( uint => BidDetails ) BidMap;
    
  uint[] public bidMaps;

  event AcceptedBid(uint bidId, uint tenderRefNo, uint bidderId, uint biddingDate);

  constructor() public {
    manager=msg.sender;
  }
    
  function acceptBid(
    uint _bidId,uint _tenderRefNo,string memory _tenderName,uint _bidSubmissionOpeningDate,
    uint _bidSubmissionClosingDate,uint _bidderId, string memory _bidderName, uint _bidAmount)
    public //checkPresence(_bidId) 
    payable returns (bool ){

    
      BidMap[_bidId].bidId=_bidId;
      BidMap[_bidId].tenderRefNo=_tenderRefNo;
      BidMap[_bidId].tenderName=_tenderName;
      BidMap[_bidId].bidSubmissionOpeningDate=_bidSubmissionOpeningDate;
      BidMap[_bidId].bidSubmissionClosingDate=_bidSubmissionClosingDate;
      BidMap[_bidId].biddingDate=now;
      BidMap[_bidId].bidderId=_bidderId;
      BidMap[_bidId].bidderName=_bidderName;
      BidMap[_bidId].bidAmount=_bidAmount;
          
      bidMaps.push(_bidId)-1;

      emit AcceptedBid(_bidId, _tenderRefNo,_bidderId,now);
      return true;
    //}
  }
    
  function displayAllBids() public view onlyManager returns (uint[] memory){
    return bidMaps;
  }
    
  function displayBid(uint _bidId) public view onlyManager afterTenderClosingDate( _bidId )
    returns (uint, uint, string memory, uint, string memory ,uint){
        
      return (BidMap[_bidId].bidId,BidMap[_bidId].tenderRefNo,
      BidMap[_bidId].tenderName,BidMap[_bidId].bidderId,
      BidMap[_bidId].bidderName,BidMap[_bidId].bidAmount);
  }

  //function modifyBidClosingDate() payable{}  
  //Modify it later Dont allow Engineer to view BidderId or bidderName
  modifier onlyManager(){
      require(msg.sender==manager,"Access Denied!"); 
      _;
  }
    
  modifier afterTenderClosingDate(uint _bidId) {
      require(BidMap[_bidId].bidSubmissionClosingDate < now,"Bidding Not Closed!");
       _;
  }

  /*modifier checkPresence(uint _tenderRefNo){
    require(BidMap[_bidId].bidId!=_bidId,"");
    _;
    
  }
  
  function checkBidPresence(uint _bidId)  returns (bool ){
    if(BidMap[_bidId].bidId==_bidId)
      return true;
    else
      return false;
  }*/
}
/*
Final Fields while Bidding:
BidderId
TenderId
ItemID
itemCost
experienceInField
turnOver
----->>>>
Auto Generate Bid Id and Email it to Bidder also Show on UI in Applied Tenders
*/