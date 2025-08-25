import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VoteOption from "./VoteOption";
import ResultsChart from "./ResultsChart";
import { CheckCircle } from "lucide-react";
import { PollOption } from "./PollCard";

const initialOptions: PollOption[] = [
  {
    id: "vscode",
    title: "VS Code",
    description: "Free source-code editor made by Microsoft",
    votes: 423,
    color: "hsl(210, 100%, 60%)"
  },
  {
    id: "webstorm",
    title: "WebStorm",
    description: "Powerful IDE for modern JavaScript development",
    votes: 156,
    color: "hsl(45, 100%, 50%)"
  },
  {
    id: "vim",
    title: "Vim/Neovim",
    description: "Highly configurable text editor built to enable efficient text editing",
    votes: 134,
    color: "hsl(120, 50%, 40%)"
  },
  {
    id: "sublime",
    title: "Sublime Text",
    description: "Sophisticated text editor for code, markup and prose",
    votes: 89,
    color: "hsl(30, 100%, 50%)"
  }
];

const DevToolsPoll = () => {
  const [options, setOptions] = useState<PollOption[]>(initialOptions);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    // Check if user has already voted in this session for dev tools poll
    const voted = sessionStorage.getItem("hasVotedDevTools");
    const votedOption = sessionStorage.getItem("selectedDevToolsOption");
    
    if (voted === "true" && votedOption) {
      setHasVoted(true);
      setSelectedOption(votedOption);
    }

    // Calculate total votes
    const total = options.reduce((sum, option) => sum + option.votes, 0);
    setTotalVotes(total);
  }, [options]);

  const handleVote = (optionId: string) => {
    if (hasVoted) return;

    setOptions(prevOptions =>
      prevOptions.map(option =>
        option.id === optionId
          ? { ...option, votes: option.votes + 1 }
          : option
      )
    );

    setHasVoted(true);
    setSelectedOption(optionId);
    
    // Store vote in session storage
    sessionStorage.setItem("hasVotedDevTools", "true");
    sessionStorage.setItem("selectedDevToolsOption", optionId);
  };

  const resetPoll = () => {
    sessionStorage.removeItem("hasVotedDevTools");
    sessionStorage.removeItem("selectedDevToolsOption");
    setHasVoted(false);
    setSelectedOption("");
  };

  return (
    <section className="section-container bg-gradient-to-br from-purple-50 to-pink-100" id="poll">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="section-title text-foreground mb-4">
            Development Tools Poll 2024
          </h2>
          <p className="section-subtitle mx-auto">
            What's your go-to code editor or IDE for development?
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Badge variant="secondary" className="px-3 py-1">
              Total Votes: {totalVotes}
            </Badge>
            {hasVoted && (
              <Badge variant="default" className="px-3 py-1 bg-pulse-500">
                <CheckCircle className="w-3 h-3 mr-1" />
                You Voted
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Voting Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Cast Your Vote
                {hasVoted && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetPoll}
                    className="text-xs"
                  >
                    Vote Again
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                {hasVoted 
                  ? "Thanks for voting! You can change your vote anytime." 
                  : "Choose your favorite development tool below."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {options.map((option) => (
                <VoteOption
                  key={option.id}
                  option={option}
                  onVote={handleVote}
                  hasVoted={hasVoted}
                  isSelected={selectedOption === option.id}
                  totalVotes={totalVotes}
                />
              ))}
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Live Results</CardTitle>
              <CardDescription>
                Real-time voting results updated instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResultsChart options={options} />
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <Card className="glass-card mt-8">
          <CardHeader>
            <CardTitle>Poll Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {options.map((option) => {
                const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : "0";
                return (
                  <div key={option.id} className="text-center p-4 rounded-lg bg-muted/30">
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {percentage}%
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {option.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {option.votes} votes
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DevToolsPoll;