import { Metadata } from "next";
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: "Algorithm Problems | ZenithSolve",
  description: "Browse our collection of algorithm problems with real-world applications",
};

export default function ProblemsPage() {
  redirect('/');
}