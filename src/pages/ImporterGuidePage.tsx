import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { GitBranch, Link, FileCode, Server, MousePointerClick, Save, ChevronsRight } from 'lucide-react';

const GuideStep: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
  <div className="flex gap-6">
    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-slate/10 flex items-center justify-center text-primary-slate">
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      <div className="text-text-secondary space-y-4">{children}</div>
    </div>
  </div>
);

const ImporterGuidePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-text-primary">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-text-primary mb-4">
              Existing Project Importer
            </h1>
            <p className="text-lg text-text-secondary mb-12">
              Learn how to connect your existing Next.js project to enable powerful, in-place visual content editing for your team.
            </p>

            <section className="mb-16">
              <h2 className="text-3xl font-bold text-primary-slate mb-6">1. The Project Onboarding Flow</h2>
              <div className="space-y-10">
                <GuideStep icon={<GitBranch size={24} />} title="Step 1: Connect Git Repository">
                  <p>Connect your GitHub, GitLab, or Bitbucket account using OAuth. Once connected, you'll select the Next.js project you wish to make editable. Our system requires clone access to your repository to create preview deployments.</p>
                </GuideStep>
                <GuideStep icon={<Link size={24} />} title="Step 2: Define Content Source">
                  <p>Our builder operates as a "Headless CMS." You must provide an API endpoint URL where your page's content is stored (typically as a JSON object). The builder will read from and write to this endpoint, acting as the management layer for your content.</p>
                </GuideStep>
                <GuideStep icon={<FileCode size={24} />} title="Step 3: Instrument Your Code">
                  <p>To make your Next.js project compatible, you must add a special <code>data-editable-field</code> attribute to the elements you want to be editable. This attribute tells our builder which piece of content corresponds to which element.</p>
                  <div className="p-4 bg-secondary-gray border border-border-color rounded-lg mt-4">
                    <h4 className="font-semibold text-text-primary mb-2">Example: Making a Headline Editable</h4>
                    <p className="text-sm text-text-secondary mb-2">The value of the attribute (e.g., "hero.title") must match the key in your content JSON.</p>
                    <pre className="text-sm bg-background p-3 rounded-md overflow-x-auto"><code>
{`// Before (Not Editable)
<h1>My Hardcoded Headline</h1>

// After (Editable with the Builder)
<h1 data-editable-field="hero.title">
  {props.pageData.hero.title}
</h1>`}
                    </code></pre>
                  </div>
                </GuideStep>
                <GuideStep icon={<Server size={24} />} title="Step 4: Initial Build & Deploy">
                  <p>Once you confirm your code is instrumented, our backend service will clone your repository, run the build process, and deploy the site to a unique preview environment (e.g., <code>my-project.builder.com</code>). This becomes your live editing canvas.</p>
                </GuideStep>
              </div>
            </section>

            <section className="mb-16">
              <h2 className="text-3xl font-bold text-primary-slate mb-6">2. The In-Place Editing Experience</h2>
              <div className="space-y-6 text-text-secondary">
                <p>To activate the editor, simply navigate to your deployed preview site and add the <code>?edit=true</code> query parameter to the URL. This will load the builder's UI on top of your live site.</p>
                <p>The builder's script automatically scans the page for <code>data-editable-field</code> attributes. When you click on an element with this attribute, it becomes highlighted, and the corresponding content and style controls will appear in the sidebar, ready for you to edit.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-primary-slate mb-6">3. The Content Update Flow (How Saving Works)</h2>
              <p className="text-text-secondary mb-6">A crucial principle of this system is that <strong>we never modify your code</strong>. All changes are saved as content to your specified API endpoint. Here's the flow:</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-secondary-gray rounded-lg border border-border-color">
                  <MousePointerClick size={20} className="text-primary-slate flex-shrink-0" />
                  <p>A user changes a headline in the visual editor and clicks "Save".</p>
                </div>
                <div className="flex justify-center"><ChevronsRight size={20} className="text-text-secondary rotate-90" /></div>
                <div className="flex items-center gap-4 p-4 bg-secondary-gray rounded-lg border border-border-color">
                  <Server size={20} className="text-primary-slate flex-shrink-0" />
                  <p>The builder sends the updated JSON content to our backend.</p>
                </div>
                <div className="flex justify-center"><ChevronsRight size={20} className="text-text-secondary rotate-90" /></div>
                <div className="flex items-center gap-4 p-4 bg-secondary-gray rounded-lg border border-border-color">
                  <Save size={20} className="text-primary-slate flex-shrink-0" />
                  <p>Our backend makes a secure request to your Content API Endpoint, saving the new JSON data.</p>
                </div>
                <div className="flex justify-center"><ChevronsRight size={20} className="text-text-secondary rotate-90" /></div>
                <div className="flex items-center gap-4 p-4 bg-secondary-gray rounded-lg border border-border-color">
                  <GitBranch size={20} className="text-primary-slate flex-shrink-0" />
                  <p>The next time your Next.js site loads, it fetches the updated content. Your code remains untouched in your Git repository.</p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ImporterGuidePage;
