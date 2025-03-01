
import { NavBar } from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Github, Mail } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState({
    github: false,
    google: false,
    email: false
  });
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  
  const navigate = useNavigate();

  const handleGithubLogin = async () => {
    setIsLoading(prev => ({ ...prev, github: true }));
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/mypage`
        }
      });

      if (error) {
        console.error('GitHub login error:', error);
        throw error;
      }

      if (data) {
        toast.success("GitHubでログインしました");
        navigate("/mypage");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("GitHubログインに失敗しました。ネットワーク接続を確認してください。");
    } finally {
      setIsLoading(prev => ({ ...prev, github: false }));
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(prev => ({ ...prev, google: true }));
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/mypage`
        }
      });

      if (error) {
        console.error('Google login error:', error);
        throw error;
      }

      if (data) {
        toast.success("Googleでログインしました");
        navigate("/mypage");
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Googleログインに失敗しました。ネットワーク接続を確認してください。");
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("メールアドレスを入力してください");
      return;
    }

    setIsLoading(prev => ({ ...prev, email: true }));
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/mypage`
        }
      });

      if (error) {
        console.error('Email login error:', error);
        throw error;
      }

      if (data) {
        toast.success("認証メールを送信しました。メールをご確認ください。");
        setEmail("");
        setShowEmailInput(false);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("メールでのログインに失敗しました。ネットワーク接続を確認してください。");
    } finally {
      setIsLoading(prev => ({ ...prev, email: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-melon-700 to-melon-900">
      <NavBar />
      <div className="max-w-md mx-auto px-4 pt-32">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-xl border border-white/20">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">ログイン</h1>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-[#24292F] hover:bg-[#24292F]/90 text-white"
              onClick={handleGithubLogin}
              disabled={isLoading.github}
            >
              <Github className="mr-2 h-5 w-5" />
              {isLoading.github ? "GitHubと連携中..." : "GitHubでログイン"}
            </Button>

            <Button 
              className="w-full bg-white hover:bg-gray-100 text-gray-900"
              onClick={handleGoogleLogin}
              disabled={isLoading.google}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              {isLoading.google ? "Googleと連携中..." : "Googleでログイン"}
            </Button>

            <Button 
              variant="premium"
              className="w-full"
              onClick={() => setShowEmailInput(prev => !prev)}
            >
              <Mail className="mr-2 h-5 w-5" />
              メールでログイン
            </Button>
          </div>

          {showEmailInput && (
            <form onSubmit={handleEmailLogin} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="メールアドレスを入力"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
                <Button 
                  type="submit"
                  variant="premium"
                  className="w-full"
                  disabled={isLoading.email}
                >
                  {isLoading.email ? "送信中..." : "認証メールを送信"}
                </Button>
              </div>
              <p className="text-xs text-white/70 text-center">
                ※ 入力したメールアドレスに認証リンクが送信されます
              </p>
            </form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-white/70">または</span>
            </div>
          </div>

          <p className="text-sm text-white/70 text-center">
            アカウントをお持ちでない場合は<br />
            上記の方法でそのまま新規登録できます
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
