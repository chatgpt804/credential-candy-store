
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Mock data for service requests (in a real app, this would come from the store)
const MOCK_REQUESTS = [
  { 
    id: "req-1", 
    service: "Netflix", 
    requestedBy: "user@example.com", 
    requestedOn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending" 
  },
  { 
    id: "req-2", 
    service: "Disney+", 
    requestedBy: "another@example.com", 
    requestedOn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved" 
  },
  { 
    id: "req-3", 
    service: "HBO Max", 
    requestedBy: "test@example.com", 
    requestedOn: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "denied" 
  }
];

const RequestsPanel = () => {
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const handleStatusChange = (requestId: string, newStatus: string) => {
    setRequests(prevRequests => 
      prevRequests.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20"><CheckCircle2 className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'denied':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="h-3 w-3 mr-1" /> Denied</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Requests</CardTitle>
        <CardDescription>Manage user requests for new services</CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.service}</TableCell>
                  <TableCell>{request.requestedBy}</TableCell>
                  <TableCell>{formatDate(request.requestedOn)}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-green-500 hover:text-green-700 hover:bg-green-100"
                          onClick={() => handleStatusChange(request.id, 'approved')}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                          onClick={() => handleStatusChange(request.id, 'denied')}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> Deny
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10 bg-muted rounded-md">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p>No service requests found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestsPanel;
