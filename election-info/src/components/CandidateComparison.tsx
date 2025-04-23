import Candidate from "./Candidate/Candidate";

const person = [
  {
    "firstName": "Person",
    "lastName": "McLastname",
    "party": "Democrat",
    "position": {
      "title": "Person",
      "tenure": "2010 - present"
    },
    "website": "https://totallylegitwebsite.com",
    "image": "/src/assets/candidate1.png",
    "keyIssues": [
      {"position": "Tax the wealthy more, and lower taxes for the middle class"},
      {"position": "Maybe lobbyists shouldn't be a thing, you know?" },
      {"position": "Healthcare is a right, not a privilege"},
    ]
  },
  {
    "firstName": "Firstname",
    "lastName": "McStupidface",
    "party": "Republican",
    "position": {
      "title": "Person",
      "tenure": "2004 - present"
    },
    "website": "https://totallylegitwebsite.com",
    "image": "/src/assets/candidate2.png",
    "keyIssues": [
      {"position": "Drugs are bad, m'kay?"},
      {"position": "Make America great again, again!"},
      {"position": "Women, am I right?"},
    ]
  }
];

const CandidateComparison = () => {
  return (
    <>
    <section>
        <div className="px-4 py-4 h-96 lg:h-[500px]">
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold">Candidates - Governer of Coolsville</h2>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row">
              <div className="flex flex-col basis-1/2 items-center"><Candidate candidate={person[0]} /></div>
              <div className="flex flex-col basis-1/2 items-center"><Candidate candidate={person[1]} /></div>
            </div>
          </div>
        </div>
    </section>
    </>
  )
}

export default CandidateComparison