import type { ICandidate } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Mail, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

interface CandidateCardProps {
    candidate: ICandidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <Link to={`/candidates/${candidate.id}`}>
        <Card className="hover:bg-accent hover:text-accent-foreground transition-colors">
        <CardHeader className="p-4">
            <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                {candidate.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-xs">
                <Mail className="h-3 w-3" />
                {candidate.email}
            </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
             <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Briefcase className="h-3 w-3" />
                Applied for Job ID: {candidate.jobId}
             </div>
        </CardContent>
        </Card>
    </Link>
  );
}