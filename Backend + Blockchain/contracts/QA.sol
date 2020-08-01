pragma solidity >=0.4.0 <0.7.0;
pragma experimental ABIEncoderV2;
contract QA{
    address public QualityAssuranceOfficer;
    struct tenderDetails{
        uint tenderRefNum;
        uint contractApprovalDate; 
        uint value;//value
        string vendor;//Vendor name
    }
    struct deliveryDetails{
        uint scheduledDeliveryDate ;
        uint actualDeliverDate;
    }
    struct QNADetails{
        string contractId;
        tenderDetails td;
        deliveryDetails dd;
        uint total;
        string result;
    }
    mapping (string => uint ) internal controlContractIds;
    mapping (string => QNADetails) QNAMaps;
    string[] public  AllQNA;
    
     constructor () public {
         QualityAssuranceOfficer=msg.sender;
     }
    
    function addQNA(
        string memory _contractId, uint _tenderRefNum , //string memory _nodalCenter,
        uint _contractAppovalDate,//string memory _description, 
        uint _value, string memory _vendor,
        uint  _scheduledDeliveryDate, uint _actualDeliverDate,
        uint256 _DeliveryPerformance, uint256 _QualityPerformance, uint256 _ReliabilityPerformance
        )public  onlyQualityEngineer() contractDoesNotExists(_contractId)  returns (bool){
        
        QNAMaps[_contractId].td = tenderDetails( _tenderRefNum, _contractAppovalDate, _value, _vendor);
        QNAMaps[_contractId].dd = deliveryDetails(_scheduledDeliveryDate,_actualDeliverDate);
        QNAMaps[_contractId].total=  _DeliveryPerformance + _QualityPerformance + _ReliabilityPerformance;
        QNAMaps[_contractId].result = getperformance(QNAMaps[_contractId].total);
        controlContractIds[_contractId]=1;
        AllQNA.push(_contractId);
        
        return true;
    }
    

    modifier onlyQualityEngineer(){
        require(msg.sender == QualityAssuranceOfficer,"Not Authorized"); _;
    }
    modifier contractDoesNotExists(string memory _contractId){
        require(controlContractIds[_contractId]==0,"Entry already Exists");
         _;
    }

    function getAllQNAKeys() public view returns(string[] memory){
        return AllQNA;
    }
  
   function getBasicQNA(string memory _contractId) public view returns(string memory, uint ,
   uint,uint, string memory, uint, string memory){
       
       return (_contractId,QNAMaps[_contractId].td.tenderRefNum,
       QNAMaps[_contractId].dd.actualDeliverDate, QNAMaps[_contractId].td.value,
       QNAMaps[_contractId].td.vendor,QNAMaps[_contractId].total,QNAMaps[_contractId].result);
       
   }
  
   function getperformance(uint total) private pure returns(string memory) {
         string memory result;
        if(total <= 60){
                 result = "POOR";
              } else if( total >= 61 && total <= 75 ){
                 result = "FAIR";
              } else if( total >= 76 && total <= 90 ){
                 result = "GOOD";
              } else if( total >= 91 && total <= 100 ){
                 result = "VERYGOOD";
        }
        return result;
    }
}