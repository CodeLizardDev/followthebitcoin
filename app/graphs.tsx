import type { ReactNode } from 'react';

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
  // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
  return (
    <svg
      className="transaction-map"
      viewBox={`0 0 570 ${tall ? 453 : 306}`}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

export function AddressGraph({
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

export function SpendGraph({
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
export function CoinjoinGraph({ mode }: { mode: CoinjoinMode }) {
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
