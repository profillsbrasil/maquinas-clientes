"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, Settings, LogOut, Menu } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-card border-r transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6">Máquina Clientes</h2>
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => router.push("/dashboard")}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              disabled
            >
              <Users className="h-4 w-4" />
              Clientes
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              disabled
            >
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="mb-2 text-sm">
            <p className="font-medium truncate">{session.user.name}</p>
            <p className="text-muted-foreground text-xs truncate">
              {session.user.email}
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-card/50 backdrop-blur-sm flex items-center px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-xl font-semibold">Dashboard</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Bem-vindo, {session.user.name}! 👋
              </h2>
              <p className="text-muted-foreground">
                Este é seu painel de controle
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total de Clientes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Nenhum cliente cadastrado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Status da Conta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">Ativa</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email:{" "}
                    {session.user.emailVerified
                      ? "Verificado ✓"
                      : "Não verificado"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Último Acesso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">Agora</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Informações da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Nome</span>
                  <span className="font-medium">{session.user.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{session.user.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-medium font-mono text-xs">
                    {session.user.id}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
