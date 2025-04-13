const CandidateKeyIssues = ({ positions }: { positions: string[] }) => {
  return (
    <div className="flex flex-col p-2 ">
      {positions.map((item, key) => (
        <div key={key} className="border p-2">
          <span>{item}</span>
        </div>
      ))}
    </div>
  )
}

export default CandidateKeyIssues