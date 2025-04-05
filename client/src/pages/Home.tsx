import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobSearchApp from "@/components/JobSearchApp";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F2EF]">
      <Header />
      <main className="flex-grow">
        <JobSearchApp />
      </main>
      <Footer />
    </div>
  );
}
