// This file contains the smart contract that handles all of the voting functionality
//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract UniversalVotingSystem {

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

    //Adds a new candidate when called by the contract owner
    function addCandidate(string memory _name) public {
        require(bytes(_name).length > 0, "candidate name can't be empty."); //Checks that the parameter isn't empty
        require(contractOwner == msg.sender, "Only the contract owner can add candidates..."); //Checks whether caller is the owner
        c_id_counter++; //generates a new id for the candidate
        candidates[c_id_counter] = Candidate(c_id_counter, _name, 0, true); //creates a new candidate
        candidatesCount++;
    }

    //Deletes a candidate
    function deleteCandidate(uint256 _candidateId) public {
        require(contractOwner == msg.sender, "Only the contract owner can delete candidates..."); //Checks whether caller is the owner
        require(candidates[_candidateId].exists, "Invalid candidate ID."); //Checks whether the candidate exists
            delete candidates[_candidateId];
            candidatesCount--;
    }

    //Adds a tier to given address
    function addTier(address _address, uint256 _tier) public {
        require(contractOwner == msg.sender, "Only the contract owner can modify tiers..."); //Checks whether caller is the owner
        require(_tier > 0, "Tier must be higher than 0.");
        tierHolders[_address] = true; //maps that the person has a tier higher than 1
        tiers[_address] = _tier; //maps the users tier
    }

    //Adds a new vote
    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "You have already voted."); //Checks whether this address has already voted
        require(candidates[_candidateId].exists, "Invalid candidate ID."); //Checks whether the candidate exists
        if (!tierHolders[msg.sender]){ //If the voter doesn't have a tier, vote counts as 1
            candidates[_candidateId].votes++;
            voters[msg.sender] = true;
        }
        else{//if the voter does have a tier, the vote counts as n (the value of the tier)
            uint256 votingPower = tiers[msg.sender];
            candidates[_candidateId].votes += votingPower;
            voters[msg.sender] = true; //Marks that the person has voted
        }
    }

    //Returns ONLY the number of votes a certain candidate has received
    function getCandidateVotes(uint _candidateId) public view returns (uint) {
        require(candidates[_candidateId].exists, "Invalid candidate ID."); //Checks whether the candidate exists
        return candidates[_candidateId].votes;
    }

}
