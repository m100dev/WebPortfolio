import React from 'react'

// "Interview Talking Points", the AVD guide's closing section.
// Hidden while job hunting and deliberately NOT imported anywhere, so its text isn't in the
// deployed bundle. To restore it: render <InterviewPoints /> as the last child of the guide's
// root <div> in AvdEnterpriseWorkspace.jsx, and add interviewTocEntry back to the end of avd/toc.js.
export const interviewTocEntry = { id: 'iv', text: 'Interview Talking Points', sub: false }

const InterviewPoints = () => (
  <>
    <div className="phase" id="iv">
      <div className="phase-num">{"IV"}</div>
      <h2>{"Interview Talking Points"}</h2>
      <p>{"Senior interviewers ask scenario questions, not factual ones. Be ready for these:"}</p>
    </div>
    <div className="sec">
      <div className="card">
        <div className="card-title">{"\"Tell me about a complex problem you solved.\""}</div>
        <div className="card-body">{"Walk through the AVD activation issue: explain the five root causes, why a single fix doesn't work (each user's token folder is per-profile, the broker cache is separate from license tokens, registry pollution requires HKCU access), and how you built a multi-layer detection + remediation that runs in user context with admin-context fallback for HKLM. Mention the logging and rollback design."}</div>
      </div>
      <div className="card">
        <div className="card-title">{"\"How do you decide between GPO and Intune?\""}</div>
        <div className="card-body">{"GPO for domain-joined machines that never leave the corporate network, Intune for everything else. AVD session hosts can co-manage — use GPO for FSLogix and Office baseline (mature, well-documented), Intune for Remediations and per-user overrides. Avoid "}<em>{"duplicate"}</em>{" settings in both — pick one or you'll fight yourself."}</div>
      </div>
      <div className="card">
        <div className="card-title">{"\"Why hybrid identity instead of pure cloud?\""}</div>
        <div className="card-body">{"Reality: 70% of enterprises still have on-prem dependencies — file shares, line-of-business apps with legacy auth, network appliances that authenticate against LDAP. Pure cloud is the destination, hybrid is the journey. Entra Connect lets you modernize one workload at a time without forcing every system to change at once."}</div>
      </div>
      <div className="card">
        <div className="card-title">{"\"Walk me through your FSLogix decisions.\""}</div>
        <div className="card-body">{"Profile container size 30 GB (Outlook 3-month cache + OneDrive Files On-Demand keeps profile small), VHDX format (not VHD), stored on Premium Azure Files joined to AD. Did NOT include Office activation in the Office Container because Modern Auth handles token refresh — including it caused token conflicts in early deployments. Flip-flop folder naming for easier troubleshooting."}</div>
      </div>
      <div className="card">
        <div className="card-title">{"\"What's your monitoring strategy?\""}</div>
        <div className="card-body">{"Three layers: (1) Intune Remediations report shows detection trends — if activation failures spike, something upstream changed. (2) AVD diagnostics workbook for session host health. (3) Azure Monitor alerts on FSLogix profile load failures. The auto-remediation removes most help desk tickets but the data tells me when the underlying problem changes."}</div>
      </div>
      <div className="card">
        <div className="card-title">{"\"How did you build the lab?\""}</div>
        <div className="card-body">{"Hyper-V on my workstation for the on-prem footprint — DC01, FS01, ENTRA01, MGMT01 on an internal vSwitch with NAT for internet egress. Azure for AVD, the M365 tenant, and the cloud-side identity. Entra Connect sat on its own member server (ENTRA01) — never install it on a DC in production. This setup mirrors a real small-to-mid enterprise hybrid: cheap, realistic, and forces you to think about cross-boundary connectivity, which is where most real-world AVD problems originate."}</div>
      </div>
    </div>
  </>
)

export default InterviewPoints
