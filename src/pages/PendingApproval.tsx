import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Mail, LogOut } from 'lucide-react';

export default function PendingApproval() {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">Account Pending Approval</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Thank you for registering! Your account is currently awaiting approval from an administrator.
            </p>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              You will be able to access all features once an admin approves your registration. 
              Please check back later or contact the administrator for assistance.
            </p>
            
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => signOut()}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
