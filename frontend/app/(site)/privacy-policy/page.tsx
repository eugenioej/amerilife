import type { Metadata } from "next";
import { LegalPageLayout } from "@/app/components/legal/LegalPageLayout";
import { staticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = staticPageMetadata(
  "Privacy Policy | AmeriLife",
  "AmeriLife Privacy Policy - Learn how we collect, use, and protect your personal information.",
  "/privacy-policy/"
);

export default function PrivacyPolicyPage() {
  return (
    <div className="privacy">
    <LegalPageLayout
      title="Privacy Policy"
      breadcrumb={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      amlPlainText
    >
      
        <p>
          This Privacy Policy outlines how the AmeriLife® family of companies (“AmeriLife,” “we,” “us,” or “our”) 
          collect and use personal information through AmeriLife.com (the “Website”). 
        </p>

        <h2>Notice at Collection for California Residents</h2>
        <p>
          If you are a California resident, the sections below include additional information that 
          we provide pursuant to the California Consumer Privacy Act of 2018 as amended from time to time 
          (“CCPA”). Those sections provide information regarding the categories of information to be collected, 
          the purposes for which the categories of information are collected or used, whether the information 
          is sold or shared, and how long the information is retained. You can find those details by clicking 
          on the links above.
        </p>

        <h2>Personal Information Collection</h2>
        <p>
        We may collect personal information directly from you and automatically when you use the Website, as described below.
        </p>
        <p className="privacy-subheading">
          <em>Information we collect directly from you.</em>

        </p>
        <p>
          When you use or access our Website, we may collect information directly from you, such as the following:
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
          <li><strong>Contact information</strong>, such as your first and last name, email address, and phone number.</li>
          <li><strong>Payment card information</strong>, such as your payment card number, expiration date, security code, and billing address.</li>
          <li><strong>Information you submit through our “Find an Agent” feature</strong>, including your ZIP code, product interests, and any other 
            information that you choose to provide.</li>
          <li><strong>Any information you provide when you submit an indication of interest on the “Join Our Team” section of the Website</strong>, 
            including contact and account registration information such as first name, last name, password, postal address, email address, 
            and phone number, your resume, your cover letter, information about your skills and qualifications, responses to application 
            questions and voluntary disclosures and self-identification prompts, and any other information you may choose to provide.</li>
          <li><strong>Any information you provide through submissions like “Contact Us” forms</strong>, which may include the subject of your inquiry, 
            your message to us, and any other information that you choose to provide.</li>
        </ul>
        <p className="privacy-subheading">
          <em>Information we collect automatically.</em>
        </p>
        
        <p>
          We may also collect certain device, usage, and other information automatically when you use the Website, including through 
          cookies, which are small files placed on your device to store data that can be recalled by the Website, pixels, web beacons, 
          and other storage technologies provided by third parties. The information we collect automatically may include:
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
          <li><strong>Device and Browser Information</strong>: When you visit the Website, we will automatically collect certain information about your 
            device and browser. For example, we may receive device identifiers such as MAC address, your IP address, your operating system type 
            and version, your browser type, version, and settings, and the approximate geographic location indicated by your IP address.</li>
          <li><strong>Usage and Log Information</strong>: When you use the Website, we will collect certain information about how you use the Website, 
            such as features visited and used, date of visit or usage, clicks, text entered, time spent using the Website or particular features, 
            errors, log files, including for query tracking, events, and errors, and other details of your actions on the Website. </li>
          <li><strong>Information Collected in Connection with Analytics Technology</strong>: We may collect information in connection with third-party 
            analytics technologies, such as Google Analytics and Facebook Analytics. For more information on Google Analytics, including how Google 
            Analytics collects, uses, and discloses information, please refer to <a href="https://www.google.com/policies/privacy/partners/" target="_blank" rel="noopener noreferrer">www.google.com/policies/privacy/partners/</a>. We may also use other 
            technologies that collect analytics information about your activities on our Website. </li>
        </ul>
        <p>
          If you permit it using settings available on our site, we may allow third parties to use the Website to collect and record personal information 
          about your online activities over time and across different Website, applications, and other online products or Website. Those third parties may 
          receive the information we collect automatically and use it for measurement services, marketing, advertising, and other purposes on behalf of us, 
          their organization, or their other customers, including delivering interest-based advertising.
        </p>

        <h2>Purposes for Which We Collect, Use, and Disclose Your Personal Information</h2>
        <p>
          We may use, disclose, transmit, transfer, store, and otherwise process your personal information for various purposes, including:
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
          <li>Conducting our business, operating our organization, and providing and modifying our products and services to you and others;</li>
          <li>Communicating with you, including by responding to your inquiries, and promoting our Website and our other products, services, 
            and offerings that we make available through our Website;</li>
          <li>Marketing and promoting our organization, products, and services, including through targeted and cross-context behavioral advertising;</li>
          <li>Recruiting and hiring purposes, including evaluating and processing your employment application;</li>
          <li>Communicating with and providing information to business partners, including other financial and insurance institutions, 
            insurance agents and brokers, and other organizations with which we partner to offer products and services for our customers, 
            prospective customers, and business partners.</li>
          <li>Communicating with and providing information to service providers, contractors, and other third 
            parties we use to support our organization, including providers of technologies and services that 
            we use to automatically collect or otherwise process device, usage, and other information from you, 
            such as our analytics providers;</li>
          <li>Providing, developing, maintaining, personalizing, and improving our Website, our products, our services, and our organization;</li>
          <li>Performing analytics, evaluating usage trends, and measuring the effectiveness of our Website;</li>
          <li>Complying with legal or regulatory requirements, judicial process, and our company policies (including due diligence and contracting activities);</li>
          <li>Securing our Website, including protecting against and responding to fraud, unlawful activity (such as incidents of hacking or misuse of our Website), 
            and claims and other liabilities, including by enforcing our policies;</li>
          <li>Creating aggregate or deidentified data;</li>
          <li>Evaluating or conducting a corporate transaction, such as an actual or potential merger, divestiture, restructuring, reorganization, dissolution,
            or other sale or transfer of some or all of our assets; and</li>
          <li>For any other purpose, as you may authorize or direct or as we otherwise disclose, when you provide the information.</li>
        </ul>
        <h2>How We Disclose Your Personal Information </h2>
        <p>
          We may disclose your information to third parties, including to:
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
          <li>Our affiliates, subsidiaries, and other entities in the AmeriLife group of companies.</li>
          <li>Business partners, including other financial and insurance institutions, insurance agents 
            and brokers, and other organizations with which we partner to offer products and Website for our 
            customers, prospective customers, and business partners.</li>
          <li>Service providers, contractors, and other third parties we use to support our organization, 
            including providers of technologies and Websites that we use to automatically collect or otherwise 
            process device, usage, and other information from you, such as our analytics providers, and advertising 
            partners and networks that enable or participate in targeted and cross-context behavioral advertising;</li>
          <li>Third parties we use to market and promote our organization, products, and services;</li>
          <li>Third parties as necessary to comply with any court order, law, or legal process, including to respond 
            to any government or request, to protect and secure our Website and the rights, property, or safety of our 
            regulatory users, employees, and organization, protect against fraud or other unlawful activity, and to 
            enforce or apply our policies and other agreements;</li>
          <li>Another person or organization in the event of a corporate transaction, such as an actual or potential 
            merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all 
            of our assets; </li>
          <li>For the purposes described in the “Purposes for Which We Collect, Use, and Disclose Your Personal Information” section above; and</li>
          <li>Any other parties as you may authorize or direct, or as we otherwise disclose, when you provide the information.</li>
        </ul>
        <h2>Your Choices</h2>
        <p>
          You may choose not to provide the personal information we request. However, not providing information we request may restrict your ability 
          to use certain features on our Website. For example, you may use the cookie manager on our site to restrict the collection of personal information 
          and use of cookies, or similar functionality through your device&apos;s operating system, your browser, or by disabling cookies, but doing so may prevent 
          you from using the functionality of the Website.
        </p>
        <p>
          Some Internet browsers have a “do-not-track” feature that lets you tell this Website that you do not want to have your online activities tracked. 
          You may be able to restrict the collection of personal information or functionality through your device&apos;s operating system or by disabling cookies. 
          To change your web browser settings for cookies, you can follow the instructions in the help section of your web browser or visit <a href="https://allaboutcookies.org/" target="_blank" rel="noopener noreferrer">https://allaboutcookies.org/</a>. 
          You can also opt out of Google Analytics by downloading, installing, and enabling the Google Analytics&apos; Opt-out Browser Add-on, which can be found at 
          <a href="https://tools.google.com/dlpage/gaoptout/" target="_blank" rel="noopener noreferrer">https://tools.google.com/dlpage/gaoptout/</a>. 
        </p>
        <p>
          For information about interest-based advertising, and to opt out of this type of advertising by parties that participate in self-regulatory programs, 
          please visit the Network Advertising Initiative at <a href="https://thenai.org/opt-out" target="_blank" rel="noopener noreferrer">https://thenai.org/opt-out</a> and/or YourAdChoices offered by the Digital Advertising Alliance (DAA) 
          Self-Regulatory Program for Online Behavioral Advertising at <a href="https://youradchoices.com/" target="_blank" rel="noopener noreferrer">https://youradchoices.com/</a>. Please note that any opt-out choice you exercise through 
          these programs will apply to interest-based advertising that your opt-out addresses, but will still allow the collection of data for other purposes,
          including research, analytics, and internal operations. You also may continue to receive advertising, but that advertising may be less relevant to 
          your interests.
        </p>

        <h2>Additional Information for Residents of California</h2>
        <p>
          This section of the Privacy Policy applies only to consumers who reside in California (as used in this section, “consumers” or “you”) 
          and to our processing of personal information of particular consumers or consumer households&apos; personal information (“California Personal Information”) 
          that AmeriLife collects through the Website. California Personal Information does not include, and this section of the Policy does not apply to, information that 
          is subject to exceptions from the California Consumer Privacy Act of 2018 (“CCPA”), such as deidentified information. 
        </p>
        <p className="privacy-subheading">
          <em>California Personal Information We Collect</em>
        </p>
        <p>
          We may collect, and may have collected in the preceding 12 months, the categories of California Personal Information described in the 
          “Personal Information Collection” section above, which includes:
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
          <li>Identifiers, including unique and online identifiers.</li>
          <li>Internet or other electronic network activity information.</li>
          <li>Commercial information.</li>
          <li>Professional or employment-related information.</li>
          <li>Geolocation data, such as your approximate location as derived from your IP address.</li>
          <li>Inferences drawn from your activity and information we collect.</li>
          <li>Other categories of personal information described in California law.</li>
          <li>Sensitive personal information in the form of payment card information described in the “Personal Information Collection” section above.</li>
        </ul>
        <p className="privacy-subheading">
          <em>Retention of California Personal Information We Collect</em>
        </p>
        <p>
          Unless an applicable law dictates a different retention period, we retain Personal Information for as long as reasonably necessary to carry out 
          the purposes described in this Policy. 
        </p>
        <p className="privacy-subheading">
          <em>Sources of California Personal Information </em>
        </p>
        <p>
          We may collect California Personal Information directly from consumers, automatically and indirectly from consumers as described in the “Information 
          We Collect Automatically” subsection above, or from third parties. 
        </p>
        <p className="privacy-subheading">
          <em>Use and Disclosure of California Personal Information </em>
        </p>
        <p>
          We may use California Personal Information for the purposes described in the “Purposes for Which We Collect, Use, and Disclose Your Personal Information” 
          section above. Notwithstanding the foregoing, we do not collect, use, or disclose California Personal Information defined as sensitive by the CCPA for the 
          purpose of inferring characteristics about you.
        </p>
        <p>
          In the preceding 12 months, we may have disclosed the categories of California Personal Information to the corresponding third parties for a business purpose:
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
          <li>Identifiers, including unique and online identifiers—to our affiliates, subsidiaries, business partners, service providers, contractors, and as otherwise 
            described in the “How We Disclose Your Personal Information” section above.</li>
          <li>Internet or other electronic network activity information—to our affiliates, subsidiaries, business partners, service providers, contractors, and as 
            otherwise described in the “How We Disclose Your Personal Information” section above.</li>
          <li>Commercial information—to our affiliates, subsidiaries, business partners, service providers, contractors, and as otherwise described in the “How We Disclose
            Your Personal Information” section above.</li>
          <li>Professional or employment-related information—to our affiliates, subsidiaries, service providers, contractors, and as otherwise described in the “How We 
            Disclose Your Personal Information” section above.</li>
          <li>Geolocation data, such as your approximate location as derived from your IP address—to our affiliates, subsidiaries, business partners, service providers, 
            contractors, and as otherwise described in the “How We Disclose Your Personal Information” section above.</li>
          <li>Inferences drawn from your activity and information we collect—to our affiliates, subsidiaries, business partners, service providers, contractors,
            and as otherwise described in the “How We Disclose Your Personal Information” section above.</li>
          <li>Other categories of personal information described in California law—to our affiliates, subsidiaries, business partners, service providers, 
            contractors, and as otherwise described in the “How We Disclose Your Personal Information” section above.</li>
          <li>Sensitive personal information in the form of payment card information described in the “Personal Information Collection” section above—to 
            our affiliates, subsidiaries, service providers, and contractors.</li>
        </ul>
        <p className="privacy-subheading">
          <em>California Personal Information Sales and Sharing for Cross-context Behavioral Advertising </em>
        </p>
        <p>
          We do not sell California Personal Information in exchange for monetary consideration. However, the CCPA defines “sale” very broadly in a manner 
          that includes disclosing California Personal Information in exchange for any other valuable consideration, and also regulates the “sharing” of California 
          Personal Information with third parties for cross-context behavioral advertising purposes, which means displaying advertising to you based on California Personal
          Information obtained or inferred from your activities over time across different websites, applications, and other online services we do not operate. Under the 
          CCPA, we may “sell” or “share,” and we may in the preceding 12 months have “sold” or “shared,” the following categories of California Personal Information:
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
          <li>Identifiers, including unique and online identifiers.</li>
          <li>Internet or other electronic network activity information</li>
          <li>Inferences drawn from your activity and information we collect.</li>
        </ul>
        <p>
          We may have sold or shared each of these categories of California Personal Information with third parties such as advertising partners and networks that 
          enable or participate in targeted and cross-context behavioral advertising, and analytics providers that provide online tracking technologies that we use to
          analyze use of the Website. Our purpose for such sales and sharing is to enable or participate in in targeted and cross-context behavioral advertising and 
          perform analytics.
        </p>
        <p>
          We do not have actual knowledge that we sell California Personal Information of consumers under 16 years of age or share the California Personal Information of 
          consumers under the age of 16 for cross-context behavioral advertising purposes.
        </p>
        <p className="privacy-subheading">
          <em>California Personal Information Rights and Choices </em>
        </p>
        <p>
          The CCPA provides consumers with specific rights regarding California Personal Information. This section describes those rights.
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
          <li><em className="privacy-subheading">Right to Access.</em> You may request that we disclose the following information about our collection, use, and disclosure of your California Personal Information
            during the applicable time period for your request:
              <ul style={{ listStyleType: "circle", paddingLeft: "2rem" }}>
                <li>The categories of California Personal Information we have collected about you.</li>
                <li>The categories of sources for the California Personal Information we collected about you.</li>
                <li>Our business or commercial purpose for collecting California Personal Information about you.</li>
                <li>The categories of third parties to whom we disclosed your California Personal Information.</li>
                <li>The specific pieces of California Personal Information we have collected about you.</li>
                <li> If we disclosed your California Personal Information for a business purpose, a list of the categories of third parties
                  to whom we disclosed California Personal Information for a business purpose identifying the categories of California Personal Information
                    disclosed to those parties in the preceding 12 months.</li>
              </ul>
            </li>
        </ul>
        <p>
          You may request to receive a copy of your Personal Information in a portable and, if technically feasible, readily usable format that allows you 
          to transmit your Personal Information to another person or entity.
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
          <li><em  className="privacy-subheading">Right to Deletion.</em> You may request that we delete your California Personal Information, 
          subject to certain exceptions.</li>
          <li><em  className="privacy-subheading">Right to Correct Inaccuracies.</em> You may request that we correct California Personal Information
          about you that is inaccurate. We will consider the nature of the California Personal Information and the purposes of our processing when we address your request.</li>
          <li><em  className="privacy-subheading">Right to Opt Out of Sales of California Personal Information and Sharing of California Personal Information
            for Cross-Context Behavioral Advertising.</em> You may request that we not sell your California Personal Information or share your California Personal Information for cross-context behavioral advertising. You may make this request through the cookie manager available on our site. 
              We have also configured our Website to process opt-out preference signals that may allow you to inform us of your desire to opt out of sales or sharing as described in the above paragraph. Opt-out preference signals must be in a format commonly used and recognized by businesses and be delivered by a platform, technology, or mechanism that makes clear to consumers that the use of the signal is meant to have the effect of opting the consumer out of sales and sharing of California Personal Information as described above. If you do not have an account with us or are not logged into your account, your opt-out preference signal will be linked to your browser identifier only and may not be linked to other California Personal Information, such as account information, about you that we process that is not associated with your browser identifier. 
              If we receive an opt-out preference signal from you, we may offer you the option to provide additional information to help facilitate your opt-out request. We may also notify you if an opt-out preference signal we receive from you conflicts with your privacy settings or participation in certain programs we offer, and request your consent to sales or sharing of California Personal Information or to affirm your intent to withdraw from any relevant programs.  

              Even if you opt out of sales or sharing of your California Personal Information for cross-context behavioral advertising, you may still see our ads online at other sites and apps, and we may still base aspects of ads on your interactions with us and the Website.
              </li>
          
        </ul>
      <p className="privacy-subheading">
          <em>Exercising California Personal Information Access, Deletion, and Correction Rights and Choices </em>
        </p>
        <p>
          Consumers or authorized agents of consumers who would like to exercise the consumer access, deletion, and correction rights described above can submit a 
          verifiable request by calling us at (844) 340-9494 or by emailing us at <a href="mailto:privacy@amerilife.com">privacy@amerilife.com</a>.
        </p>
        <p>
          Only you, or an agent that you authorize to act on your behalf, may make a verifiable consumer request related to your Personal Information.
        </p>
        <p>
          Your request must provide information sufficient to verify you are the person about whom we collected Personal Information. To verify your request, 
          we may ask you to provide information such as your first and last name, address, email address, phone number, and any other information necessary to 
          verify your identity. Your request must also include sufficient detail for us to properly understand, evaluate, and respond to it.
        </p>
        <p>
          You may designate an authorized agent to submit requests on your behalf in certain circumstances. We may require additional information when requests
          are submitted through an authorized agent, such as by requiring the submission of signed written permission for the agent to act on your behalf and 
          requiring you to verify your identity directly or directly confirm the authorized agent’s permission to act on your behalf.
        </p>
        <p>
          We cannot respond to a request or provide you with Personal Information if we cannot verify your identity or authority to make the request and/or confirm
          the Personal Information relates to you. If we cannot fulfill, or are permitted to decline, your request then we will notify you or your authorized agent.
        </p>
        <p>
          We do not charge a fee to process or respond to your verifiable consumer request unless it is excessive, repetitive, or manifestly unfounded. 
          If we determine that the request warrants a fee, we will notify you before you incur any fee. We reserve the right to either refuse to act on your request 
          or charge you a reasonable fee to complete your request if it is excessive, repetitive, or manifestly unfounded.
          </p>
          <p>
            Subject to certain exceptions, you have the right to not to be retaliated against for exercising the rights described above.
          </p>
          <h2>Additional Information for Residents of Certain US States</h2>
          <p>
            Certain US states have enacted consumer privacy laws that may apply to AmeriLife and require additional privacy information disclosures to residents 
            of those states who interact with us in an individual or household context and where an exception does not apply.
          </p>
          <p>
            This section supplements the rest of our Privacy Policy by providing additional information and describing certain rights that apply only to those 
            individuals. It does not apply to information that is subject to exceptions from those laws, such as deidentified information.
          </p>
        <p className="privacy-subheading">
          <em>Sensitive Data </em>
        </p>
        <p>
          The payment card information described in the “Personal Information Collection” section above may be defined as sensitive data, depending on the state of residence.
        </p>
        <p className="privacy-subheading">
          <em>Deidentified Information</em>
        </p>
        <p>
          If we process personal information to create deidentified information, we will maintain and use such deidentified information in deidentified form 
          and will not attempt to reidentify such deidentified information except to the extent permitted by applicable law.
        </p>
        <p className="privacy-subheading">
          <em>Consumer Rights and Choices </em>
        </p>
        <p>
          Under the state laws described above, residents of those states may have certain rights with respect to our processing of their personal information 
          as described below. There may be limitations or exceptions that apply to your request. When you make a request, we may provide more detailed information 
          regarding any legal requirements applicable to your request and whether any exception or limitation applies. 
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "2rem" }}>
          <li>
            <em className="privacy-subheading">Right to Access.</em>{" "}
            You may have the right to request that we confirm that we process your
            personal information, or to ask us for access to the personal information
            we have collected about you.
          </li>

          <li>
            <em className="privacy-subheading">
              Right to Correct Inaccuracies.
            </em>{" "}
            You can ask us to correct personal information we have about you that is
            inaccurate. We will take into account the nature of the personal
            information and the purposes of our processing when we address your
            request.
          </li>

          <li>
            <em className="privacy-subheading">Right to Deletion.</em>{" "}
            Subject to certain exceptions, you may have the right to request that we
            delete the personal information that we collected about you.
          </li>

          <li>
            <em className="privacy-subheading">
              Right to Data Portability.
            </em>{" "}
            You may have the right to request that we provide you a copy of your
            personal information in a portable and, to the extent technically feasible,
            readily usable format that allows you to transmit the data to another
            controller without hindrance.
          </li>

          <li>
            <em className="privacy-subheading">
              Right to Third-party Disclosure Information.
            </em>{" "}
            You may have the right to request certain information regarding the third
            parties to whom we have disclosed your personal information.
          </li>

          <li>
            <em className="privacy-subheading">
              Right to Revoke Consent.
            </em>{" "}
            If we are processing your personal information pursuant to your previously
            granted consent, then you have the right to revoke your consent by
            contacting us as described in the “How to Contact Us” section below. Please
            note that revoking your consent will not affect any processing we have
            undertaken based on your consent before it was revoked.
          </li>
        </ul>
        <p>
          You can request to exercise the rights above by submitting an authenticated request by calling us at (844) 340-9494 or by emailing us at <a href="mailto:privacy@amerilife.com">privacy@amerilife.com</a>.
        </p>
        <p>
          We will not discriminate against you for exercising these rights. 
        </p>
        <h2>Third-Party Links</h2>
        <p>
          This website contains links to other sites that may be helpful to our users. AmeriLife provides these links for your convenience and is 
          not responsible for the accuracy or completeness of these external sites. AmeriLife is not responsible for the content or privacy practices 
          of external sites and encourages you to review the privacy policies of those sites before you use them.
        </p>
        <h2>Children&apos;s Privacy </h2>
        <p>
          The Website does not direct content to children under the age of eighteen and does not intend to collect personal information from children 
          under the age of eighteen. If you believe we have collected personal information from a child under the age of eighteen, please contact us as 
          described in the “How to Contact Us” section below.
        </p>
        <h2>Changes and Applicable Law</h2>
        <p>
          We may update this Policy at any time, for any reason or for no reason, and with or without notice to you. We encourage you to review this Policy 
          periodically for any updates or changes. We will post the date that the Policy has been updated so you will know when it has been changed. 
        </p>
        <h2>How to Contact Us</h2>
        <p>
          You can reach us by telephone at (844) 340-9494, by email to <a href="mailto:privacy@amerilife.com">privacy@amerilife.com</a>, or by mail to:
          <br/>
          AmeriLife
          <br/>
          Attention: Chief Legal Officer
          <br/>
          2650 McCormick Drive
          <br/>
          Clearwater, Florida 33759
        </p>
        <p>
          <em>This Privacy Notice was modified in August 2026.</em>
        </p>
     
      <style>{`
        
        .privacy h2 {
          color: #3FA590 !important;
          text-transform: uppercase !important;
          font-weight: 700 !important;
           line-height: 1.2 !important;
          letter-spacing: 0.06em !important;
          margin-bottom: 0.5rem !important;
           font-size: 1.5rem !important; 
          margin-top: 3rem !important;
        }

        .privacy p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }

        .privacy ul {
          margin-bottom: 1rem;
        }

        .privacy li {
          margin-bottom: 1rem;
        }
        .privacy-subheading {
          text-decoration: underline;
          font-weight: bold;
        }

       
      `}</style>
    </LegalPageLayout>
     </div>
  );
}
