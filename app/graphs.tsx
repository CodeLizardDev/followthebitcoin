import type { ReactNode } from 'react';
import './maps.css';

const lime = '#d4f785',
  muted = '#829084',
  line = '#445347',
  gold = '#edbd79';

function Node({
  x,
  y,
  title,
  sub,
  active = false,
  dim = false,
  width = 154,
}: {
  x: number;
  y: number;
  title: string;
  sub: string;
  active?: boolean;
  dim?: boolean;
  width?: number;
}) {
  return (
    <g opacity={dim ? 0.4 : 1}>
      <rect
        x={x}
        y={y}
        width={width}
        height={66}
        rx={12}
        fill={active ? '#273720' : '#1a251f'}
        stroke={active ? lime : line}
        strokeWidth={active ? 1.5 : 1}
      />
      <text
        x={x + 16}
        y={y + 26}
        fill={active ? lime : '#ecf0e8'}
        fontSize={14}
        fontWeight={600}
      >
        {title}
      </text>
      <text
        x={x + 16}
        y={y + 48}
        fill={muted}
        fontSize={12}
        fontFamily="monospace"
      >
        {sub}
      </text>
    </g>
  );
}
function Path({
  d,
  active = false,
  dashed = false,
}: {
  d: string;
  active?: boolean;
  dashed?: boolean;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={active ? lime : line}
      strokeWidth={active ? 2 : 1.5}
      strokeDasharray={dashed ? '5 6' : undefined}
    />
  );
}
function Frame({
  children,
  label,
  tall = false,
}: {
  children: ReactNode;
  label: string;
  tall?: boolean;
}) {
  // Inline SVG needs an image role; replacing it with img would discard the diagram.
  /* oxlint-disable jsx-a11y/prefer-tag-over-role */
  return (
    <svg
      className="transaction-map transaction-map--desktop"
      viewBox={`0 0 570 ${tall ? 453 : 306}`}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

function DesktopAddressGraph({
  changed,
  revealed,
}: {
  changed: boolean;
  revealed: boolean;
}) {
  return (
    <Frame
      label={
        changed
          ? 'Earlier payment to address A; Client B pays a separate address B. No connection between these two addresses is shown.'
          : 'An earlier 0.08 BTC payment and Client B’s 0.04 BTC payment both go to the same address.'
      }
    >
      <text x="22" y="30" fill={muted} fontSize="11" letterSpacing="2">
        PAYMENTS
      </text>
      <text x="355" y="30" fill={muted} fontSize="11" letterSpacing="2">
        RECEIVING ADDRESS
      </text>
      <Node
        x={22}
        y={64}
        title="Earlier payment"
        sub="0.08 BTC"
        dim={changed}
      />
      <Node x={22} y={202} title="Client B’s payment" sub="0.04 BTC" active />
      <Path
        d={
          changed
            ? 'M176 97 H350'
            : 'M176 97 H247 Q269 97 269 119 V149 Q269 166 291 166 H350'
        }
        active={revealed && !changed}
      />
      <Path
        d={
          changed
            ? 'M176 235 H350'
            : 'M176 235 H247 Q269 235 269 213 V183 Q269 166 291 166 H350'
        }
        active
      />
      {changed ? (
        <>
          <Node x={350} y={64} title="Address A" sub="0.08 BTC received" dim />
          <Node
            x={350}
            y={202}
            title="Fresh address B"
            sub="0.04 BTC received"
            active
          />
          <text x="350" y="177" fill={lime} fontSize="13">
            No shared address
          </text>
        </>
      ) : (
        <>
          <Node
            x={350}
            y={133}
            title="Same address"
            sub="0.12 BTC received"
            active={revealed}
            width={190}
          />
          {revealed && (
            <g>
              <circle cx="284" cy="166" r="5" fill={lime} />
              <text x="273" y="284" fill={gold} fontSize="12">
                One address connects both payments
              </text>
            </g>
          )}
        </>
      )}
    </Frame>
  );
}

function DesktopSpendGraph({
  changed,
  revealed,
}: {
  changed: boolean;
  revealed: boolean;
}) {
  return (
    <Frame
      label={
        changed
          ? 'Only the exchange coin funds the payment. The freelance coin is not spent. Fee 0.0001 BTC.'
          : 'Both the exchange and freelance coins fund a payment of 0.02 BTC, change of 0.0799 BTC and fee of 0.0001 BTC.'
      }
    >
      <text x="18" y="30" fill={muted} fontSize="11" letterSpacing="2">
        COINS TO SPEND
      </text>
      <text x="377" y="30" fill={muted} fontSize="11" letterSpacing="2">
        OUTPUTS
      </text>
      <Node x={18} y={55} title="Exchange coin" sub="0.06 BTC · known" active />
      <Node
        x={18}
        y={199}
        title="Freelance coin"
        sub={changed ? '0.04 BTC · unspent' : '0.04 BTC'}
        dim={changed}
        active={revealed && !changed}
      />
      <Path d="M172 88 H227 Q249 88 249 109 V149 H287" active />
      {!changed && (
        <Path d="M172 232 H227 Q249 232 249 211 V149" active={revealed} />
      )}
      <rect
        x="264"
        y="126"
        width="70"
        height="46"
        rx="12"
        fill="#243020"
        stroke={lime}
      />
      <text x="299" y="153" textAnchor="middle" fill={lime} fontSize="13">
        PAY
      </text>
      <Path d="M334 149 H347 V88 H377" active />
      <Path d="M334 149 H347 V232 H377" />
      <Node x={377} y={55} title="Merchant" sub="0.02 BTC" />
      <Node
        x={377}
        y={199}
        title="Change"
        sub={changed ? '0.0399 BTC' : '0.0799 BTC'}
      />
      <text x="271" y="194" fill={muted} fontSize="11">
        0.0001 BTC fee
      </text>
      {changed && (
        <text x="18" y="294" fill={lime} fontSize="12">
          The freelance coin stays outside this transaction.
        </text>
      )}
    </Frame>
  );
}

export type CoinjoinMode = 'direct' | 'coinjoin' | 'relink';
function DesktopCoinjoinGraph({ mode }: { mode: CoinjoinMode }) {
  if (mode === 'direct')
    return (
      <Frame label="Direct payment: one known input is visibly spent to the merchant and a change output. Fee 0.0001 BTC.">
        <text x="20" y="30" fill={muted} fontSize="11" letterSpacing="2">
          BEFORE
        </text>
        <Node x={20} y={116} title="Known input" sub="0.10 BTC · you" active />
        <Path d="M174 149 H305 V91 H361" active />
        <Path d="M305 149 V225 H361" active />
        <Node x={361} y={58} title="Merchant" sub="0.02 BTC" active />
        <Node x={361} y={192} title="Change" sub="0.0799 BTC" />
        <text x="201" y="286" fill={gold} fontSize="12">
          Direct connection to the known input
        </text>
      </Frame>
    );
  return (
    <Frame
      tall={mode === 'relink'}
      label={
        mode === 'relink'
          ? 'A CoinJoin output is combined with an additional known coin in a later payment. This suggests a new common-control link; it does not reveal every CoinJoin participant.'
          : 'Three participants each provide 0.1001 BTC. The CoinJoin creates three 0.1 BTC outputs and a 0.0003 BTC fee. Multiple ownership assignments fit.'
      }
    >
      <text x="18" y="24" fill={muted} fontSize="11" letterSpacing="2">
        EARLIER INPUTS
      </text>
      <text x="369" y="24" fill={muted} fontSize="11" letterSpacing="2">
        COINJOIN OUTPUTS
      </text>
      {[45, 125, 205].map((y, i) => (
        <g key={y}>
          <Node
            x={18}
            y={y}
            width={162}
            title={i === 0 ? 'Known input' : `Other input ${i}`}
            sub="0.1001 BTC"
            active={i === 0}
          />
          <Path d={`M180 ${y + 33} H226 Q240 ${y + 33} 240 158 H270`} />
          <Path d={`M301 158 H323 Q337 158 337 ${y + 33} H369`} />
          <Node
            x={369}
            y={y}
            width={169}
            title={i === 0 ? 'Used for payment' : `Output ${i + 1}`}
            sub="0.10 BTC"
            active={i === 0}
          />
        </g>
      ))}
      <rect
        x="247"
        y="64"
        width="82"
        height="179"
        rx="18"
        fill="#223020"
        stroke={lime}
        strokeDasharray="5 5"
      />
      <text x="288" y="144" textAnchor="middle" fill={lime} fontSize="22">
        ⋈
      </text>
      <text x="288" y="170" textAnchor="middle" fill={lime} fontSize="12">
        CoinJoin
      </text>
      <text x="288" y="190" textAnchor="middle" fill={muted} fontSize="10">
        3 people
      </text>
      <text
        x="288"
        y="292"
        textAnchor="middle"
        fill={mode === 'relink' ? gold : lime}
        fontSize="12"
      >
        {mode === 'relink'
          ? 'Later: this output + another known coin → new link'
          : 'All outputs are visible. The ownership match is not.'}
      </text>
      {mode === 'relink' && (
        <>
          <Path d="M538 78 H552 V323 H285 V351" active />
          <Node
            x={18}
            y={341}
            title="Another known coin"
            sub="0.01 BTC · you"
            active
            width={185}
          />
          <Path d="M203 374 H256" active />
          <rect
            x="256"
            y="351"
            width="65"
            height="46"
            rx="10"
            fill="#2f3520"
            stroke={gold}
          />
          <text x="288" y="379" fill={gold} fontSize="12" textAnchor="middle">
            PAY
          </text>
          <Path d="M321 374 H369" active />
          <Node
            x={369}
            y={341}
            title="Merchant"
            sub="0.02 BTC"
            active
            width={169}
          />
          <text x="285" y="432" fill={muted} fontSize="11" textAnchor="middle">
            Plus 0.0899 BTC change · 0.0001 BTC fee
          </text>
        </>
      )}
    </Frame>
  );
}

function MobileFrame({
  children,
  height,
  label,
}: {
  children: ReactNode;
  height: number;
  label: string;
}) {
  return (
    <svg
      className="transaction-map transaction-map--mobile"
      viewBox={`0 0 340 ${height}`}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

function MobileNode({
  x,
  y,
  title,
  sub,
  active = false,
  dim = false,
  width = 154,
}: {
  x: number;
  y: number;
  title: string;
  sub: string;
  active?: boolean;
  dim?: boolean;
  width?: number;
}) {
  return (
    <g opacity={dim ? 0.45 : 1}>
      <rect
        x={x}
        y={y}
        width={width}
        height={66}
        rx={12}
        fill={active ? '#273720' : '#1a251f'}
        stroke={active ? lime : line}
        strokeWidth={active ? 1.5 : 1}
      />
      <text
        x={x + 10}
        y={y + 25}
        fill={active ? lime : '#ecf0e8'}
        fontSize={13.5}
        fontWeight={600}
      >
        {title}
      </text>
      <text
        x={x + 10}
        y={y + 48}
        fill={muted}
        fontSize={12.5}
        fontFamily="monospace"
      >
        {sub}
      </text>
    </g>
  );
}

function MobileLabel({
  children,
  y,
  color = muted,
}: {
  children: ReactNode;
  y: number;
  color?: string;
}) {
  return (
    <text x={170} y={y} textAnchor="middle" fill={color} fontSize={12.5}>
      {children}
    </text>
  );
}

function MobileAddressGraph({
  changed,
  revealed,
}: {
  changed: boolean;
  revealed: boolean;
}) {
  return (
    <MobileFrame
      height={310}
      label={
        changed
          ? 'The earlier 0.08 BTC payment goes to address A. Client B’s 0.04 BTC payment goes to a fresh address B. No shared address connects them.'
          : 'An earlier payment of 0.08 BTC and Client B’s payment of 0.04 BTC both lead down to the same receiving address, which has received 0.12 BTC.'
      }
    >
      <MobileLabel y={22}>PAYMENTS</MobileLabel>
      <MobileNode
        x={8}
        y={42}
        title="Earlier payment"
        sub="0.08 BTC"
        dim={changed}
      />
      <MobileNode
        x={178}
        y={42}
        title="Client B’s payment"
        sub="0.04 BTC"
        active
      />
      {changed ? (
        <>
          <Path d="M85 108 V194" />
          <Path d="M255 108 V194" active />
          <MobileNode
            x={8}
            y={194}
            title="Address A"
            sub="0.08 BTC received"
            dim
          />
          <MobileNode
            x={178}
            y={194}
            title="Fresh address B"
            sub="0.04 BTC received"
            active
          />
          <MobileLabel y={292} color={lime}>
            No shared address
          </MobileLabel>
        </>
      ) : (
        <>
          <Path d="M85 108 V145 Q85 160 100 160 H170 V194" active={revealed} />
          <Path d="M255 108 V145 Q255 160 240 160 H170" active />
          {revealed && <circle cx={170} cy={160} r={5} fill={lime} />}
          <MobileNode
            x={68}
            y={194}
            width={204}
            title="Same receiving address"
            sub="0.12 BTC received"
            active={revealed}
          />
          <MobileLabel y={292} color={revealed ? gold : muted}>
            {revealed
              ? 'One address connects both payments'
              : 'Follow both payment paths'}
          </MobileLabel>
        </>
      )}
    </MobileFrame>
  );
}

function MobileSpendGraph({
  changed,
  revealed,
}: {
  changed: boolean;
  revealed: boolean;
}) {
  return (
    <MobileFrame
      height={405}
      label={
        changed
          ? 'The 0.06 BTC exchange coin alone funds the payment below: 0.02 BTC to the merchant, 0.0399 BTC change and a 0.0001 BTC fee. The 0.04 BTC freelance coin remains unspent.'
          : 'The 0.06 BTC exchange coin and 0.04 BTC freelance coin combine in one payment below. It creates 0.02 BTC for the merchant, 0.0799 BTC change and a 0.0001 BTC fee.'
      }
    >
      <MobileLabel y={22}>COINS TO SPEND</MobileLabel>
      <MobileNode
        x={8}
        y={42}
        title="Exchange coin"
        sub="0.06 BTC · known"
        active
      />
      <MobileNode
        x={178}
        y={42}
        title="Freelance coin"
        sub={changed ? '0.04 BTC · unspent' : '0.04 BTC'}
        dim={changed}
        active={revealed && !changed}
      />
      <Path d="M85 108 V135 Q85 147 97 147 H158 Q170 147 170 159 V179" active />
      {!changed && (
        <Path
          d="M255 108 V135 Q255 147 243 147 H182 Q170 147 170 159"
          active={revealed}
        />
      )}
      <rect
        x={132}
        y={179}
        width={76}
        height={46}
        rx={12}
        fill="#243020"
        stroke={lime}
      />
      <text x={170} y={207} textAnchor="middle" fill={lime} fontSize={14}>
        PAY
      </text>
      <Path d="M170 225 V248 H85 V291" active />
      <Path d="M170 248 H255 V291" />
      <MobileLabel y={275}>0.0001 BTC fee</MobileLabel>
      <MobileNode x={8} y={291} title="Merchant" sub="0.02 BTC" />
      <MobileNode
        x={178}
        y={291}
        title="Change"
        sub={changed ? '0.0399 BTC' : '0.0799 BTC'}
      />
      <MobileLabel y={389} color={changed ? lime : revealed ? gold : muted}>
        {changed
          ? 'The freelance coin remains unspent.'
          : revealed
            ? 'One payment links these two coins.'
            : 'Which coins fund the same payment?'}
      </MobileLabel>
    </MobileFrame>
  );
}

function MobileCoinjoinGraph({ mode }: { mode: CoinjoinMode }) {
  if (mode === 'direct') {
    return (
      <MobileFrame
        height={347}
        label="One known input of 0.10 BTC directly funds 0.02 BTC for the merchant, 0.0799 BTC change and a 0.0001 BTC fee."
      >
        <MobileLabel y={23}>DIRECT PAYMENT</MobileLabel>
        <MobileNode
          x={93}
          y={45}
          title="Known input"
          sub="0.10 BTC · you"
          active
        />
        <Path d="M170 111 V168 H85 V211" active />
        <Path d="M170 168 H255 V211" />
        <MobileNode x={8} y={211} title="Merchant" sub="0.02 BTC" active />
        <MobileNode x={178} y={211} title="Change" sub="0.0799 BTC" />
        <MobileLabel y={305}>0.0001 BTC fee</MobileLabel>
        <MobileLabel y={332} color={gold}>
          Direct connection to the known input
        </MobileLabel>
      </MobileFrame>
    );
  }
  const relink = mode === 'relink';
  return (
    <MobileFrame
      height={relink ? 655 : 384}
      label={
        relink
          ? 'Three 0.1001 BTC inputs create three equal 0.10 BTC CoinJoin outputs and a 0.0003 BTC fee. Later, one output is combined with another known 0.01 BTC coin, creating a common-control clue. The later payment sends 0.02 BTC to the merchant, returns 0.0899 BTC change and pays a 0.0001 BTC fee.'
          : 'Three participants provide 0.1001 BTC each to a single CoinJoin. Below it are three equal 0.10 BTC outputs. The fee is 0.0003 BTC. Several assignments of inputs to outputs fit the visible transaction.'
      }
    >
      <MobileLabel y={22}>EARLIER INPUTS</MobileLabel>
      {[8, 120, 232].map((x, i) => (
        <g key={x}>
          <MobileNode
            x={x}
            y={40}
            width={100}
            title={i === 0 ? 'Known input' : `Input ${i + 1}`}
            sub="0.1001 BTC"
            active={i === 0}
          />
          <Path d={`M${x + 50} 106 V125 H170 V145`} />
          <Path d={`M170 211 V235 H${x + 50} V257`} />
          <MobileNode
            x={x}
            y={257}
            width={100}
            title={i === 0 ? 'Used to pay' : `Output ${i + 1}`}
            sub="0.10 BTC"
            active={i === 0}
          />
        </g>
      ))}
      <rect
        x={45}
        y={145}
        width={250}
        height={66}
        rx={16}
        fill="#223020"
        stroke={lime}
        strokeDasharray="5 5"
      />
      <text x={170} y={171} textAnchor="middle" fill={lime} fontSize={17}>
        CoinJoin
      </text>
      <MobileLabel y={195}>3 people · 0.0003 BTC fee</MobileLabel>
      {relink ? (
        <>
          <MobileLabel y={351} color={gold}>
            LATER: COMBINING COINS
          </MobileLabel>
          <Path d="M58 323 V453 H132" active />
          <MobileNode
            x={178}
            y={373}
            title="Another known coin"
            sub="0.01 BTC · you"
            active
          />
          <Path d="M255 439 V453 H208" active />
          <rect
            x={132}
            y={430}
            width={76}
            height={46}
            rx={12}
            fill="#2f3520"
            stroke={gold}
          />
          <text x={170} y={458} textAnchor="middle" fill={gold} fontSize={14}>
            PAY
          </text>
          <Path d="M170 476 V504 H85 V527" active />
          <Path d="M170 504 H255 V527" />
          <MobileNode x={8} y={527} title="Merchant" sub="0.02 BTC" active />
          <MobileNode x={178} y={527} title="Change" sub="0.0899 BTC" />
          <MobileLabel y={620}>Later payment fee: 0.0001 BTC</MobileLabel>
          <MobileLabel y={645} color={gold}>
            Combining them creates a new clue.
          </MobileLabel>
        </>
      ) : (
        <>
          <MobileLabel y={352} color={lime}>
            All outputs are public.
          </MobileLabel>
          <MobileLabel y={376} color={lime}>
            Several ownership matches fit.
          </MobileLabel>
        </>
      )}
    </MobileFrame>
  );
}

export function AddressGraph(props: { changed: boolean; revealed: boolean }) {
  return (
    <>
      <DesktopAddressGraph {...props} />
      <MobileAddressGraph {...props} />
    </>
  );
}

export function SpendGraph(props: { changed: boolean; revealed: boolean }) {
  return (
    <>
      <DesktopSpendGraph {...props} />
      <MobileSpendGraph {...props} />
    </>
  );
}

export function CoinjoinGraph(props: { mode: CoinjoinMode }) {
  return (
    <>
      <DesktopCoinjoinGraph {...props} />
      <MobileCoinjoinGraph {...props} />
    </>
  );
}
