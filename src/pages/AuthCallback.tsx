
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any hash fragments for OAuth 
    if (window.location.hash && window.location.hash.includes("access_token")) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const handleCallback = async () => {
      try {
        // Get the current URL
        const url = window.location.href;
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data.session) {
          console.log("User is logged in:", data.session.user.email);
          toast.success("ログインしました！");
          navigate("/mypage");
        } else {
          console.log("No active session found in callback");
          
          // Check for error parameter in URL
          const params = new URLSearchParams(window.location.search);
          const errorParam = params.get("error");
          const errorDescription = params.get("error_description");
          
          if (errorParam) {
            throw new Error(errorDescription || errorParam);
          } else {
            // Try to parse hash fragment
            const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
            const fragmentError = fragmentParams.get("error");
            const fragmentErrorDescription = fragmentParams.get("error_description");
            
            if (fragmentError) {
              throw new Error(fragmentErrorDescription || fragmentError);
            } else {
              // No session, no error - redirect to login
              navigate("/login");
            }
          }
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(err.message);
        toast.error("認証エラー: " + err.message);
        
        // After 3 seconds, redirect to login
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-melon-700 to-melon-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-xl border border-white/20 w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          {error ? "認証エラー" : "ログイン処理中..."}
        </h1>
        
        {error ? (
          <div className="text-red-300 mb-4 text-center">
            <p>{error}</p>
            <p className="mt-4 text-white/70">
              3秒後にログインページに戻ります...
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
