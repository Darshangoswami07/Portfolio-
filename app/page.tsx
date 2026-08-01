import Layout from './components/Layout';
import HeroClientWrapper from './components/HeroClient';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import TechCloud from './components/TechCloud';
import Projects from './components/Projects';
import GithubStats from './components/GithubStats';
import Resume from './components/Resume';
import AppointmentSection from './components/appointments/AppointmentSection';
import FAQ from './components/FAQ';
import BlogPlaceholder from './components/BlogPlaceholder';
import Contact from './components/Contact';

export default function Home() {
  return (
    <Layout>
      <HeroClientWrapper />
      <About />
      <Experience />
      <Skills />
      <TechCloud />
      <Projects />
      <GithubStats />
      <Resume />
      <AppointmentSection />
      <FAQ />
      <BlogPlaceholder />
      <Contact />
    </Layout>
  );
}
