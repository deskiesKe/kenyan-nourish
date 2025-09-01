import { MpesaPayment } from "@/components/MpesaPayment";

const Premium = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Premium Access
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock premium features and exclusive content with our affordable premium subscription
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Premium Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h3 className="font-medium">Exclusive Recipe Access</h3>
                  <p className="text-sm text-muted-foreground">Access to premium recipes from professional chefs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h3 className="font-medium">AI Nutritionist Chat</h3>
                  <p className="text-sm text-muted-foreground">Get personalized nutrition advice from our AI chatbot</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h3 className="font-medium">Meal Planning Tools</h3>
                  <p className="text-sm text-muted-foreground">Advanced meal planning and grocery list generation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <h3 className="font-medium">Priority Support</h3>
                  <p className="text-sm text-muted-foreground">Get faster response times and dedicated support</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <MpesaPayment />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;