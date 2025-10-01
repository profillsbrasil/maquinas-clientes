"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Lock, Zap, Users } from "lucide-react";

export default function Home() {
  const { data: session, isPending } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <nav className="border-b bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">Máquina Clientes</h1>
            <div className="flex gap-4">
              {isPending ? (
                <div className="h-10 w-20 animate-pulse bg-muted rounded-md" />
              ) : session ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline">Entrar</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Criar Conta</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-8 py-12">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Sistema de Autenticação
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Autenticação segura e moderna com Better Auth, Next.js 15 e
              Drizzle ORM
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            {!session && (
              <>
                <Link href="/signup">
                  <Button size="lg" className="gap-2">
                    <Users className="h-5 w-5" />
                    Começar Agora
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Lock className="h-5 w-5" />
                    Fazer Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-16">
          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Seguro</CardTitle>
              <CardDescription>
                Autenticação robusta com Better Auth
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Proteção de dados e sessões seguras com as melhores práticas de
                segurança.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Rápido</CardTitle>
              <CardDescription>Next.js 15 com Turbopack</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Performance otimizada com o mais recente do Next.js e React 19.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Type-Safe</CardTitle>
              <CardDescription>TypeScript e Drizzle ORM</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Desenvolvimento seguro com tipagem completa em todo o stack.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Completo</CardTitle>
              <CardDescription>Sistema pronto para produção</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Login, registro, sessões e proteção de rotas já configurados.
              </p>
            </CardContent>
          </Card>
        </div>

        {session && (
          <Card className="mt-16">
            <CardHeader>
              <CardTitle>Você está autenticado! 🎉</CardTitle>
              <CardDescription>
                Bem-vindo de volta, {session.user.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button>Ir para o Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
