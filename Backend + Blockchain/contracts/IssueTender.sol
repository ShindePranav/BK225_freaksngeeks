pragma solidity >= 0.5.0 <0.7.0;
//pragma solidity ABIEncoderV2;

contract IssueTender {
    //declare owner of SC
    address public projectEngineer;

    enum TenderStatus{ ACTIVE,AWARDED, CLOSED, RETENDERED}
    //fields Tender specific
     struct  TenderDetails{
         
        //unique Identifier for Tender
        uint tenderRefNo;
        string tenderName;
        string tenderType;
        string tenderCategory;
        uint bidSubmissionOpeningDate;
        uint bidSubmissionClosingDate;
        TenderStatus tenderStatus;
        
  	}

    mapping (uint => TenderDetails) TenderMapped;

    uint[] public Tenders;
     event TenderCreated(uint _tenderRefNo,string  _tenderName, string  _tenderType,string  _tenderCategory, uint _bidSubmissionOpeningDate,uint _bidSubmissionClosingDate);
    constructor () public {
        //assign owner
        projectEngineer = msg.sender;
    }

    //function to create Tender
    function createTender(
        uint _tenderRefNo,string memory _tenderName,
        string memory _tenderType,string memory _tenderCategory,
        uint _bidSubmissionOpeningDate,uint _bidSubmissionClosingDate ) public onlyEngineer notPresent(_tenderRefNo)
		returns (bool){

        
		//TenderMapped[_tenderRefNo] = TenderMapped(_tenderRefNo, _tenderName, _tenderType, _tenderCategory, now, _bidSubmissionClosingDate);
			TenderMapped[_tenderRefNo].tenderRefNo = _tenderRefNo;
			TenderMapped[_tenderRefNo].tenderName = _tenderName;
			TenderMapped[_tenderRefNo].tenderType = _tenderType;
			TenderMapped[_tenderRefNo].tenderCategory = _tenderCategory;
			TenderMapped[_tenderRefNo].bidSubmissionOpeningDate = _bidSubmissionOpeningDate;
			TenderMapped[_tenderRefNo].bidSubmissionClosingDate = _bidSubmissionClosingDate;
			TenderMapped[_tenderRefNo].tenderStatus=TenderStatus.ACTIVE;
			Tenders.push(_tenderRefNo);
			emit TenderCreated(_tenderRefNo,_tenderName,_tenderType,_tenderCategory,_bidSubmissionOpeningDate,_bidSubmissionClosingDate);
			return true;
	
      }
    
    function intToStatus(uint status) private pure checkValidSatus(status) returns(TenderStatus){
        if(status==0){
            return TenderStatus.ACTIVE;
        }
        else if(status == 1){
            return TenderStatus.AWARDED;
        }
        else if(status == 2){
            return TenderStatus.CLOSED;
        }
        else{
            return TenderStatus.RETENDERED;
        }
    }
    
    function statusToInt(TenderStatus status) private pure returns (uint){
        if(status == TenderStatus.ACTIVE){
            return 0;
        }
        else  if(status == TenderStatus.AWARDED){
            return 1;
        }
        else  if(status == TenderStatus.CLOSED){
            return 2;
        }
        else{
            return 3;
        }
    }
    
    //function to view all tenders
    function viewTenders() public view returns ( uint[] memory){
        //allow everyone to view
        return Tenders;
    }
    
    //function to view tenders
    function viewTender( uint _tenderRefNo) public view CheckPresence(_tenderRefNo)
	returns( uint, 
    string memory,string memory,//string memory,
    uint ,uint,
	uint ){
        
        uint status = statusToInt(TenderMapped[_tenderRefNo].tenderStatus);
        //allow everyone to view
        return (_tenderRefNo, 
		TenderMapped[_tenderRefNo].tenderName,
        TenderMapped[_tenderRefNo].tenderType,
		//TenderMapped[_tenderRefNo].tenderCategory,
        TenderMapped[_tenderRefNo].bidSubmissionOpeningDate,
        //---------------------ERROOOORRRRR CompilerError: Stack too deep, try removing local variables.-----
        TenderMapped[_tenderRefNo].bidSubmissionClosingDate,
        status);
	}  

    
    function updateStatus(uint _tenderRefNo, uint status) public onlyEngineer checkValidSatus(status) payable returns (bool) {
        
        uint current= statusToInt( TenderMapped[_tenderRefNo].tenderStatus );
        
        if(status>current){
            TenderMapped[_tenderRefNo].tenderStatus = intToStatus(status);
            return true;
        }
        return false;
    
    }
    
    modifier checkValidSatus(uint status){
        require(status>0 && status<4,"Undefined Status number");
        _;
    }
    
	modifier notPresent(uint _tenderRefNo){
        require(TenderMapped[_tenderRefNo].tenderRefNo!=_tenderRefNo,"Tender Already Present"); _;
    }
    //modifier to restrict Tender Creation
    modifier onlyEngineer(){
    	require(projectEngineer==msg.sender,"Access denied!");
    	_;
    }
	modifier CheckPresence(uint _tenderRefNo){
		require(TenderMapped[_tenderRefNo].tenderRefNo==_tenderRefNo,"Tender Not Present");
		_;
	}
		
}/*

compile
./node_modules/.bin/truffle develop
migrate
IssueTender.deployed().then( function(instance){ issue = instance; })
web3.eth.getAccounts().then(function(res) { accounts = res; } )
issue.createTender("1","fvdfG","rfrf","rfre","11","23",{from : accounts[0]})

"compiler":{"version":"0.5.16+commit.9c3226ce"},"language":"Solidity","output":{"abi":[{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"Tenders","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_tenderRefNo","type":"uint256"},{"internalType":"string","name":"_tenderName","type":"string"},{"internalType":"string","name":"_tenderType","type":"string"},{"internalType":"string","name":"_tenderCategory","type":"string"},{"internalType":"uint256","name":"_bidSubmissionOpeningDate","type":"uint256"},{"internalType":"uint256","name":"_bidSubmissionClosingDate","type":"uint256"}],"name":"createTender","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"projectEngineer","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_tenderRefNo","type":"uint256"}],"name":"viewTender","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewTenders","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}],"devdoc":{"methods":{}},"userdoc":{"methods":{}}},"settings":{"compilationTarget":{"/Users/Ajit/Desktop/Demo1/contracts/IssueTender.sol":"IssueTender"},"evmVersion":"istanbul","libraries":{},"optimizer":{"enabled":false,"runs":200},"remappings":[]},"sources":{"/Users/Ajit/Desktop/Demo1/contracts/IssueTender.sol":{"keccak256":"0x31aae36de479a844ab4beca6542401f6a13e4616b3a37e5b23058e438af301d1","urls":["bzz-raw://768afb81853d46157652537d57a728c909f2d072b385acbc10f00589755e91b6","dweb:/ipfs/QmZqftBRh42koEWiCE8KBdXbcT9z5JdxHxBeGeYMWTw5Jx"]}},"version":1}

*/