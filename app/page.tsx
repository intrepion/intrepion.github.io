export default function Page() {
  return (
    <div>
      <header className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold">Oliver Forral</h1>
          <p>Meridian, ID - (503) 750-4562</p>
          <p>
            <a
              className="text-blue-500 hover:underline"
              href="mailto:intrepion@gmail.com"
            >
              intrepion@gmail.com
            </a>
          </p>
          <p>
            <a
              className="text-blue-500 hover:underline"
              href="https://oliverforral.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              oliverforral.com
            </a>
          </p>
          <p>
            <a
              className="text-blue-500 hover:underline"
              href="https://github.com/intrepion"
              rel="noopener noreferrer"
              target="_blank"
            >
              github.com/intrepion
            </a>
          </p>
          <p>
            <a
              className="text-blue-500 hover:underline"
              href="https://linkedin.com/in/intrepion"
              rel="noopener noreferrer"
              target="_blank"
            >
              linkedin.com/in/intrepion
            </a>
          </p>
        </div>
      </header>
      <main className="container mx-auto py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Senior Software Engineer
          </h2>
          <p className="text-lg">
            Highly motivated and results-oriented Software Engineer with 16+
            years of experience in designing, developing, and maintaining
            scalable and maintainable web applications, APIs, and microservices
            across diverse industries. Proven ability to collaborate effectively
            within teams, advocate for continuous improvement, and deliver
            innovative solutions using a wide range of technologies. Skilled in
            Agile methodologies, CI/CD tools, best practices, and passionate
            about contributing to the creation of impactful software.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Skills</h2>
          <div className="mb-4">
            <ul className="list-disc">
              <li>
                <span className="text-xl font-bold">Technologies:</span>
                <span> Git, Docker, NGINX, Let's Encrypt</span>
              </li>
              <li>
                <span className="text-xl font-bold">Languages:</span>
                <span> C#, TypeScript, JavaScript, PHP, Rust</span>
              </li>
              <li>
                <span className="text-xl font-bold">Frameworks:</span>
                <span> .NET, Symfony, Laravel, React, jQuery, Bootstrap</span>
              </li>
              <li>
                <span className="text-xl font-bold">Databases:</span>
                <span>
                  {" "}
                  PostgreSQL, SQL Server, MySQL, Redis, SQLite, RavenDB
                </span>
              </li>
              <li>
                <span className="text-xl font-bold">Methodologies:</span>
                <span>
                  {" "}
                  Agile (Scrum, Kanban), TDD, BDD, Ensemble Programming, Pair
                  Programming
                </span>
              </li>
              <li>
                <span className="text-xl font-bold">CI/CD Tools:</span>
                <span>
                  {" "}
                  GitHub Actions, TeamCity, Octopus Deploy, AWS CodePipeline,
                  Travis CI, Circle CI
                </span>
              </li>
              <li>
                <span className="text-xl font-bold">Testing Tools:</span>
                <span> Cypress, Specflow, Reqnroll, Selenium</span>
              </li>
              <li>
                <span className="text-xl font-bold">Soft Skills:</span>
                <span>
                  {" "}
                  Communication, Collaboration, Problem-Solving, Attention to
                  Detail, Mentorship, Teamwork
                </span>
              </li>
            </ul>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Certifications
          </h2>
          <div className="mb-4">
            <h3 className="text-xl font-bold">Amazon Web Services</h3>
            <p>AWS Certified Cloud Practitioner</p>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Experience</h2>
          <div className="mb-4">
            <h3 className="text-xl font-bold">Software Engineer - ICF</h3>
            <ul className="list-disc">
              <li>
                Collaborated with team members to design, develop, and maintain
                software solutions.
              </li>
              <li>
                Contributed to all stages of the development lifecycle,
                including requirements gathering, design, implementation,
                testing, and deployment.
              </li>
              <li>
                Authored clean and maintainable code adhering to best practices.
              </li>
              <li>
                Advocated for continuous improvement and proactively identified
                opportunities for code optimization and refactoring.
              </li>
              <li>
                Reduced manual testing time through the implementation of
                Cypress end-to-end tests, streamlining the development and
                testing cycle.
              </li>
              <li>
                Enhanced accessibility compliance to WCAG 2.1 Level AA, ensuring
                wider user inclusivity and meeting website accessibility
                standards for individuals with disabilities.
              </li>
              <li>
                Contributed to the migration effort of projects to Linux virtual
                machines, achieving a 50% cost reduction in AWS EC2 expenses.
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold">Software Engineer - Freelance</h3>
            <ul className="list-disc">
              <li>
                Provided freelance work for small local companies that needed
                web development and custom-made systems tools.
              </li>
              <li>
                Developed command-line tools that saved employees an average of
                5 hours per week
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold">Software Engineer - Enerflo</h3>
            <ul className="list-disc">
              <li>
                Utilized a wide range of full-stack capabilities at a startup
                with a very lean team.
              </li>
              <li>
                Worked on a variety of projects, including a Laravel SaaS and a
                NodeJS API.
              </li>
              <li>
                Successfully identified and resolved production bugs, preventing
                future reoccurrences.
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold">
              Software Engineer - InComm InCentives
            </h3>
            <ul className="list-disc">
              <li>
                Collaborated with a team of engineers to implement several REST
                microservices in C# and .NET Core, ensuring efficient and
                scalable communication between application components.
              </li>
              <li>Configured continuous integrations with TeamCity.</li>
              <li>
                Developed code for automating deployments into AWS S3 buckets.
              </li>
              <li>
                Implemented several REST microservices in C# and .NET Core, as
                well as front ends in TypeScript and React.
              </li>
              <li>
                Exposed to New Relic for logging and Octopus Deploy for
                deployment.
              </li>
              <li>
                Supported new engineers with getting up to speed with best
                practices.
              </li>
              <li>
                Mentored coworkers that wanted to move into software
                engineering.
              </li>
              <li>
                Championed small experiments within the team, such as doing
                mini-hackathons. These experiments have generated greater
                creativity and innovation among team members.
              </li>
              <li>
                Collaborated closely with UX Engineer to design a TypeScript
                React component library that can be used company-wide. By giving
                the company more control, employees are able to save time and
                money maintaining consistent WCAG and ADA compliant user
                interfaces across all front ends.
              </li>
              <li>
                A key player in helping a recent acquisition with their backlog
                of new features and the refactoring of old features that an
                important client was requesting. Successfully implemented the
                changes, which maintained the professional relationship with the
                client.
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold">
              Web Developer - Multnomah Education Services District
            </h3>
            <ul className="list-disc">
              <li>
                Maintained legacy applications in jQuery and updated some
                applications to React and Ember.
              </li>
              <li>
                Maintained part of Oracle database and updated applications to
                use PostgreSQL for production data and SQLite for performant
                mock testing.
              </li>
              <li>
                Maintained multiple legacy applications in PHP and updated
                applications to use REST and Symfony, which used PHP 7 and
                actual coding standards.
              </li>
              <li>
                Implemented multiple applications in Symfony and Bootstrap.
              </li>
              <li>Configured continuous integration with TravisCI.</li>
              <li>
                Creatively solved the logistics of implementing complex business
                rules.
              </li>
              <li>
                Converted projects from Subversion to Git and put them into
                GitHub. As a result, the team became more collaborative and
                completed work more efficiently.
              </li>
              <li>
                Became an expert in using Symfony for all refactors and new
                development. This also resulted in the team being more
                collaborative and getting work done more efficiently.
              </li>
              <li>
                After the company had run out of symbols in an old off-the-shelf
                product, took initiative and coded a script that recalculated
                and updated the database so it used only 10 symbols. This
                allowed us to save time and money by using the old product while
                it was systematically replaced.
              </li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-bold">
              Web Developer Intern - Miles Consulting, Inc.
            </h3>
            <ul className="list-disc">
              <li>
                Constructed and maintained an enterprise web application in
                JavaScript, which requests API calls to a C# and ASP.Net backend
                which then connects to an SQL Server database.
              </li>
              <li>
                The sole developer during this internship, was able to teach
                self how to turn a set of requirements into a full-stack web
                application while also learning C# and SQL Server.
              </li>
            </ul>
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Education</h2>
          <div className="education">
            <h3 className="text-xl font-bold">
              Bachelor of Science in Computer Science
            </h3>
            <p>Oregon State University, Graduated 2009</p>
          </div>
        </section>
      </main>
    </div>
  );
}
