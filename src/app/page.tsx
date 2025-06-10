import { Calculator } from "@/components/calculator";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-headline font-bold text-primary">
          Total Recall Calculator
        </h1>
      </header>
      <Calculator />
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Your Friendly Calculator Co.</p>
      </footer>
    </main>
  );
}
