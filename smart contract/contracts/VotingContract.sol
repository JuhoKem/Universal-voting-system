// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


contract VotingContract {


    event CandidateAdded(uint256 candidateId, string name, uint256 votes); //Listens for new candidates being added
    event CandidateDeleted(uint256 candidateId); //Listens for candidates being deleted
    event ErrorOccurred(string errorMessage); //Listens for error
    event TierAdded(address indexed _address, uint256 _tier); //Listers to a voter's tier being updated
    event voteAdded(); //Listens to new votes

    struct Candidate {
        uint256 _candidateId; //The unique id. This is used to distinguish candidates
        string name; //The name of the candidate
        uint256 votes; //The number of votes the candidate has received
        bool exists; //This is used when deleting candidates
    }
    address private contractOwner; //The owner of the contract.
    uint256 public candidatesCount; //How many candidates exist in the election
    uint256 private c_id_counter; ////Candidate id counter, needed for assigning ids to new candidates

    mapping(uint256 => Candidate) public candidates; //Mapping of candidates
    mapping(address => bool) public voters; // Mapping of people who have already voted
    mapping(address => bool) public tierHolders; //Mapping of people who have a tier
    mapping(address => uint256) public tiers; //Mapping of tier weights

    constructor() {
        contractOwner = msg.sender; //Records the owner of the contract
        candidatesCount = 0; //Number of candidates in the election
        c_id_counter = 0; //Candidate id counter
    }

    //adds a new candidate
    function addCandidate(string memory _name) public {
        if (bytes(_name).length == 0) {//Checks that the parameter isn't empty
              emit ErrorOccurred("Candidate name can't be empty.");
        } else if (contractOwner != msg.sender) {//Checks whether caller is the owner
            emit ErrorOccurred("Only the contract owner can add candidates...");
        } else {
            c_id_counter++;//generates a new id for the candidate
            uint256 theID = c_id_counter;
            uint256 theVotes = 0;

            candidates[c_id_counter] = Candidate(theID, _name, theVotes, true);//creates a new candidate
            candidatesCount++;

            emit CandidateAdded(theID, _name, theVotes); //Emit the event to the listener
        }
    }

    

    //Deletes a candidate
    function deleteCandidate(uint256 _candidateId) public {
        if (contractOwner != msg.sender) {//Checks whether caller is the owner
            emit ErrorOccurred("Only the contract owner can delete candidates...");
        } else if (!candidates[_candidateId].exists) {
            emit ErrorOccurred("Invalid candidate ID.");
        } else {
            delete candidates[_candidateId]; //Deletes the candidate
            candidatesCount--;

            emit CandidateDeleted(_candidateId);// Emit the event to the listener
        }
    }


    //Returns an array of all the candidates
    function getCandidates() public view returns (Candidate[] memory) {
    Candidate[] memory allCandidates = new Candidate[](candidatesCount);

        uint256 currentIndex = 0;

        // Iterates over all given ids and populates the array
        for (uint256 i = 1; i <= c_id_counter; i++) {
            if (candidates[i].exists) {
                allCandidates[currentIndex] = candidates[i];
                currentIndex++;
            }
        }
        return allCandidates;
    }

    //Adds a tier to given address
    function addTier(address _address, uint256 _tier) public {
        if (contractOwner != msg.sender) { //Checks whether caller is the owner
            emit ErrorOccurred("Only the contract owner can modify tiers...");
        } else if (_tier <= 0) {
            emit ErrorOccurred("Tier must be higher than 0.");
        } else {
            tierHolders[_address] = true; //maps that the person has a tier higher than 1
            tiers[_address] = _tier;//maps the users tier

            emit TierAdded(_address, _tier);
        }
    }


    // Adds a new vote
    function vote(uint _candidateId) public {
        if (voters[msg.sender]) { //If the voter has already voted once
            emit ErrorOccurred("You have already voted.");
            return;
        }
        if (!candidates[_candidateId].exists) { //If no candidate with that id exists
            emit ErrorOccurred("Invalid candidate ID.");
            return;
        }

        if (!tierHolders[msg.sender]) { // If the voter doesn't have a tier, vote counts as 1
            candidates[_candidateId].votes++;
            voters[msg.sender] = true;
        } else { // If the voter does have a tier, the vote counts as n (the value of the tier)
            uint256 votingPower = tiers[msg.sender];
            candidates[_candidateId].votes += votingPower;
            voters[msg.sender] = true; // Marks that the person has voted
        }

        emit voteAdded(); // Emit the event to the listener
}


    //Returns ONLY the number of votes a certain candidate has received
    function getCandidateVotes(uint _candidateId) public view returns (uint) {
        require(candidates[_candidateId].exists, "Invalid candidate ID."); //Checks whether the candidate exists
        return candidates[_candidateId].votes;
    }

}