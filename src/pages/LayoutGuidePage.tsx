import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LayoutGuidePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-text-primary">
      <Header />
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-text-primary mb-4">
              Understanding the Layout System
            </h1>
            <p className="text-lg text-text-secondary mb-12">
              Learn the foundational concepts of building structured, responsive layouts in Builder.
            </p>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-primary-purple mb-4">1. The Core Concept: A Hierarchy of Blocks</h2>
              <p className="text-text-secondary mb-6">
                Every webpage layout is built upon a nested structure of four key elements. To make this easy to grasp, let's use a simple analogy: <strong>Furnishing a Room</strong>.
              </p>
              <div className="space-y-4 text-text-secondary">
                <p><strong>Section:</strong> Think of a <code>Section</code> as an entire room in a house. It's the largest container and defines a whole area of your page (e.g., the living room, the kitchen).</p>
                <p><strong>Container:</strong> The <code>Container</code> is the usable area within that room, like a large rug placed in the center. You don't put furniture right up against the walls; you arrange it on the rug. The container centers your content and keeps it from touching the screen edges.</p>
                <p><strong>Row:</strong> A <code>Row</code> is like a piece of furniture on the rug, such as a bookshelf. It defines a single horizontal line where you will place items.</p>
                <p><strong>Columns:</strong> <code>Columns</code> are the individual shelves on that bookshelf. They are the vertical divisions within a row that hold the actual content.</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-primary-purple mb-4">2. Detailed Element Definitions</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-text-primary mb-2">Section</h3>
                  <p className="text-text-secondary mb-2"><strong>What it is:</strong> The highest-level and largest building block. A webpage is constructed by stacking multiple Sections vertically. Each Section represents a distinct, logical part of the page.</p>
                  <p className="text-text-secondary"><strong>Primary Function:</strong> To group large, related chunks of content and to apply full-width backgrounds (color, gradient, image, or video).</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-text-primary mb-2">Container</h3>
                  <p className="text-text-secondary mb-2"><strong>What it is:</strong> A wrapper element placed directly inside a Section. Its primary purpose is to constrain the width of the content within it.</p>
                  <p className="text-text-secondary"><strong>Primary Function:</strong> To improve readability and aesthetics on wider screens by preventing content from stretching across the entire viewport. It typically has a maximum width (e.g., 1200px) and is centered horizontally within the Section.</p>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-text-primary mb-2">Row & Columns</h3>
                  <p className="text-text-secondary mb-2"><strong>What they are:</strong> A system for creating horizontal and vertical divisions. A Row is a horizontal block placed inside a Container. This Row is then divided into one or more vertical Columns.</p>
                  <p className="text-text-secondary"><strong>Primary Function:</strong> This is the core mechanism for placing elements side-by-side. You can define a row with a 2-column, 3-column, or more complex layout. The actual content elements (text, images, buttons) are then placed inside these Columns.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-primary-purple mb-4">3. The Practical Workflow: Building a Layout</h2>
              <p className="text-text-secondary mb-6">
                Here’s a step-by-step tutorial demonstrating how you would combine these elements to create a classic "image on the left, text on the right" layout.
              </p>
              <ol className="list-decimal list-inside space-y-6 text-text-secondary">
                <li>
                  <strong className="text-text-primary">Step 1: Add a Section</strong>
                  <p className="pl-6">First, you add a new <code>Section</code> to the page. This creates a full-width block that will contain our entire component. You can set its background color to differentiate it.</p>
                </li>
                <li>
                  <strong className="text-text-primary">Step 2: Insert a Container</strong>
                  <p className="pl-6">Next, you place a <code>Container</code> element inside the Section. You will notice the content area is now centered with space on the left and right, ensuring your content will be easy to read on any device.</p>
                </li>
                <li>
                  <strong className="text-text-primary">Step 3: Define the Row and Columns</strong>
                  <p className="pl-6">Inside the Container, you add a <code>Row</code>. You configure this row to have a 2-Column layout (e.g., a 50/50 split). This creates two distinct vertical drop-zones side-by-side.</p>
                </li>
                <li>
                  <strong className="text-text-primary">Step 4: Place Content Inside the Columns</strong>
                  <p className="pl-6">Finally, you add the content widgets. In the left Column, you drag and drop an <code>Image</code> widget. In the right Column, you drag and drop a <code>Heading</code> widget and a <code>Paragraph</code> widget below it.</p>
                </li>
              </ol>
              <div className="mt-8 p-6 bg-secondary-gray border border-border-color rounded-lg">
                <h4 className="text-xl font-semibold text-text-primary mb-2">Result:</h4>
                <p className="text-text-secondary">You have successfully used the four-layer hierarchy (<code>Section</code> &gt; <code>Container</code> &gt; <code>Row</code> &gt; <code>Column</code>) to create a professional, responsive, and perfectly aligned layout. This structure is the foundation for building virtually any design on the web.</p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LayoutGuidePage;
