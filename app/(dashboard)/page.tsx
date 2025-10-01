"use client";

import { useSession } from "@/lib/auth-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Bem-vindo, {session.user.name}! 👋
          </h2>
          <p className="text-muted-foreground">Este é seu painel de controle</p>
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
                {session.user.emailVerified ? "Verificado ✓" : "Não verificado"}
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
  );
}
