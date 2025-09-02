import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Smartphone } from "lucide-react";

export const MpesaPayment = () => {
  console.log("MpesaPayment component rendering...");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('mpesa-stk-push', {
        body: { phoneNumber }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Payment Initiated",
          description: "Please check your phone and enter your M-Pesa PIN to complete the payment",
        });
      } else {
        throw new Error(data.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          M-Pesa Payment
        </CardTitle>
        <CardDescription>
          Pay KSH 100 for premium access via M-Pesa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g. 0712345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <Button 
          onClick={handlePayment} 
          disabled={loading || !phoneNumber}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay KSH 100`
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          You will receive an M-Pesa prompt on your phone to complete the payment
        </p>
      </CardContent>
    </Card>
  );
};