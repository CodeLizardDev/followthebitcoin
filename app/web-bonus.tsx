'use client';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Globe2, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function WebBonus({
  back,
  headingRef,
}: {
  back: () => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  const [connection, setConnection] = useState('direct');
  const [lookup, setLookup] = useState('address');
  return (
    <main id="main-content" className="web-main">
      <Button variant="ghost" className="back-button" onClick={back}>
        <ArrowLeft size={17} />
        Back to the game
      </Button>
      <span className="eyebrow">BONUS · BEYOND THE BLOCKCHAIN</span>
      <h1 ref={headingRef} tabIndex={-1}>
        Your visit is a request.
        <br />
        <span>It need not become a profile.</span>
      </h1>
      <p className="web-intro">
        What reaches a server and what it stores are different questions.
        Explore the difference without sharing any real connection data.
      </p>
      <div className="web-grid">
        <section className="web-panel">
          <div className="web-panel-heading">
            <Globe2 size={24} />
            <h2>Visiting a website</h2>
          </div>
          <Tabs
            value={connection}
            onValueChange={(v) => setConnection(String(v))}
          >
            <TabsList className="mode-tabs" aria-label="Connection type">
              <TabsTrigger value="direct">Direct</TabsTrigger>
              <TabsTrigger value="tor">Tor + HTTPS</TabsTrigger>
              <TabsTrigger value="onion">Onion service</TabsTrigger>
            </TabsList>
            <div className="request-flow">
              <span>Your browser</span>
              <ArrowRight size={16} />
              <span>
                {connection === 'direct' ? 'Internet' : 'Tor network'}
              </span>
              <ArrowRight size={16} />
              <span className="flow-target">Website</span>
            </div>
            <div className="request-card">
              <span className="mono-label">ILLUSTRATIVE REQUEST</span>
              <dl>
                <div>
                  <dt>Network address seen by site</dt>
                  <dd>
                    {connection === 'direct'
                      ? 'Your public connection IP'
                      : connection === 'tor'
                        ? 'A Tor exit IP'
                        : 'No visitor IP from the onion connection'}
                  </dd>
                </div>
                <div>
                  <dt>Requested page</dt>
                  <dd>/</dd>
                </div>
                <div>
                  <dt>Other information</dt>
                  <dd>Request time and browser headers</dd>
                </div>
              </dl>
            </div>
            <TabsContent value="direct">
              An IP identifies a connection, not necessarily a person. The
              serving infrastructure handles it to deliver the page.
            </TabsContent>
            <TabsContent value="tor">
              Tor hides your connection IP from the website. HTTPS encrypts
              traffic between the browser and the website, including across the
              exit relay.
            </TabsContent>
            <TabsContent value="onion">
              An onion connection stays within Tor and does not use an exit
              relay. Anything you choose to submit still reaches the
              destination.
            </TabsContent>
          </Tabs>
          <p className="simulation-note">
            This is a simulation. We have not looked up your IP or location.
          </p>
        </section>
        <section className="web-panel">
          <div className="web-panel-heading">
            <Fingerprint size={24} />
            <h2>Asking about your bitcoin</h2>
          </div>
          <Tabs value={lookup} onValueChange={(v) => setLookup(String(v))}>
            <TabsList className="mode-tabs" aria-label="Wallet lookup method">
              <TabsTrigger value="address">Address lookup</TabsTrigger>
              <TabsTrigger value="filters">Local filters</TabsTrigger>
            </TabsList>
            <div className="request-card lookup-example">
              <span className="mono-label">WHAT THE DATA SERVICE RECEIVES</span>
              <p className="code-line">
                {lookup === 'address'
                  ? '“Show activity for address A.”'
                  : '“Send these block filters.”'}
              </p>
              <p>
                {lookup === 'address'
                  ? 'The query reveals interest in a specific address. The service may connect that interest to the network request.'
                  : 'The wallet checks the filters against its addresses locally. It does not send its address list in this request.'}
              </p>
            </div>
            <TabsContent value="address">
              This is one lookup design, not how every wallet works. Asking
              about an address does not prove ownership.
            </TabsContent>
            <TabsContent value="filters">
              This reveals less specific interest. Later block requests and
              network information still matter.
            </TabsContent>
          </Tabs>
          <a
            className="source-link"
            href="https://github.com/bitcoin/bips/blob/master/bip-0157.mediawiki"
            target="_blank"
            rel="noreferrer noopener"
          >
            Read about client-side block filters ↗
          </a>
        </section>
      </div>
      <div className="info-callout">
        <h2>Collect less. Leave less to protect.</h2>
        <p>
          This game needs no account or wallet data. Its optional server counter
          stores daily totals instead of individual visits.
        </p>
        <a className="resource-link" href="#privacy">
          Read the site’s privacy details
          <ArrowRight size={17} />
        </a>
      </div>
    </main>
  );
}
