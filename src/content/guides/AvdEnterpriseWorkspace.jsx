// GENERATED from public/guides/AVD_Enterprise_Project_Guide.html by a one-off
// html.parser script; edit freely now (the original HTML is retired).
// Text is kept as {"..."} expressions so <pre> newlines and spaces survive JSX.
// Class vocabulary (phase, sec, steps/step, ib, tbl, code, kk/ks/kv/km/kc, card,
// arch-*, split-*) is styled in avd/guide-avd.css with site tokens.
import useCodeCopy from './avd/useCodeCopy'
import './avd/guide-avd.css'

const AvdEnterpriseWorkspace = () => {
  const onCopyClick = useCodeCopy()

  return (
    // Copy buttons are handled by delegation, like the original page's cp()
    // The copy buttons inside are real <button>s, so the wrapper needs no key handler (jsx-a11y is off until it supports ESLint 10)
    <div className="avd" onClick={onCopyClick}>
      <div className="phase" id="p0">
        <div className="phase-num adv">{"00"}</div>
        <h2>{"Overview & Architecture"}</h2>
        <p>{"This is a senior-track project. You'll build a full hybrid workspace where users authenticate against on-prem Active Directory, sync to Entra ID, sign into Azure Virtual Desktop session hosts, run Microsoft 365 Apps with shared computer activation, store data in OneDrive, and have any activation failures self-heal automatically via Intune."}</p>
      </div>
      <div className="sec">
        <h3>{"Scenario"}</h3>
        <p>{"You're the new cloud engineer / sysadmin at "}<strong>{"Contoso Analytics"}</strong>{", a 200-person firm migrating from on-premises file servers and physical workstations to a hybrid cloud model. Leadership wants:"}</p>
        <ul>
          <li>{"Existing AD accounts preserved (no forklift migration)"}</li>
          <li>{"Users access apps and data from anywhere via Azure Virtual Desktop"}</li>
          <li>{"OneDrive replaces local file servers for personal data"}</li>
          <li>{"Outlook and Teams work seamlessly inside AVD"}</li>
          <li><strong>{"Activation failures get fixed automatically"}</strong>{" — no more help desk tickets at 8 AM"}</li>
        </ul>
        <h3>{"Architecture Diagram"}</h3>
        <div className="arch">
          <div className="arch-title">{"Hybrid Identity + AVD + M365 Stack"}</div>
          <div className="arch-label">{"On-Prem (Hyper-V) — Identity Foundation"}</div>
          <div className="arch-tier">
            <div className="arch-node id">{"DC01 (AD DS)"}</div>
            <div className="arch-node id">{"FS01 (FSLogix)"}</div>
            <div className="arch-node id">{"ENTRA01 (Sync)"}</div>
          </div>
          <div className="arch-arrow">{"▼ ▼ ▼"}</div>
          <div className="arch-label">{"Cloud Identity"}</div>
          <div className="arch-tier">
            <div className="arch-node id">{"Entra ID"}</div>
            <div className="arch-node id">{"Entra Connect Sync"}</div>
            <div className="arch-node id">{"M365 Tenant"}</div>
          </div>
          <div className="arch-arrow">{"▼ ▼ ▼"}</div>
          <div className="arch-label">{"Policy & Security"}</div>
          <div className="arch-tier">
            <div className="arch-node sec">{"GPO (AD)"}</div>
            <div className="arch-node sec">{"Intune (Cloud)"}</div>
            <div className="arch-node sec">{"Conditional Access"}</div>
          </div>
          <div className="arch-arrow">{"▼ ▼ ▼"}</div>
          <div className="arch-label">{"Cloud Workspace (Azure)"}</div>
          <div className="arch-tier">
            <div className="arch-node">{"AVD Host Pool"}</div>
            <div className="arch-node">{"M365 Apps (SCA)"}</div>
            <div className="arch-node">{"FSLogix Profiles"}</div>
          </div>
          <div className="arch-arrow">{"▼ ▼ ▼"}</div>
          <div className="arch-label">{"User Data"}</div>
          <div className="arch-tier">
            <div className="arch-node dat">{"OneDrive (KFM)"}</div>
            <div className="arch-node dat">{"Outlook / Exchange"}</div>
          </div>
        </div>
        <h3>{"Skills Demonstrated"}</h3>
        <ul>
          <li><strong>{"Hybrid identity:"}</strong>{" AD DS, Entra Connect, password hash sync, seamless SSO"}</li>
          <li><strong>{"Endpoint management:"}</strong>{" Group Policy for domain-joined, Intune for cloud-managed"}</li>
          <li><strong>{"Cloud workspace:"}</strong>{" AVD host pools, FSLogix profile containers, multi-session Windows 11"}</li>
          <li><strong>{"Productivity stack:"}</strong>{" M365 Apps deployment, Outlook autodiscover, OneDrive Known Folder Move"}</li>
          <li><strong>{"Automation:"}</strong>{" Production-grade remediation script for SCA activation failures"}</li>
          <li><strong>{"Security:"}</strong>{" Conditional Access, MFA, break-glass accounts, least-privilege roles"}</li>
        </ul>
        <div className="ib note"><b>{"Lab Environment — Two Paths"}</b>{"You can build this two ways. "}<strong>{"Path A (Hybrid):"}</strong>{" Run AD, file server, and Entra Connect in local Hyper-V; put AVD session hosts in Azure — the most realistic enterprise scenario, ~$30/mo Azure cost. "}<strong>{"Path B (All-Azure):"}</strong>{" Run everything in Azure (including the DC, file server, and Entra Connect), ~$80/mo. If you have Hyper-V on your machine, do Path A and complete "}<a href="#p1a">{"Phase 1A"}</a>{" first."}</div>
      </div>
      <div className="phase" id="p1a">
        <div className="phase-num adv">{"1A"}</div>
        <h2>{"Hyper-V Lab Setup (Optional but Recommended)"}</h2>
        <p>{"If you have Hyper-V on your local workstation, build your on-prem footprint here. This is the most realistic path because it mirrors how most enterprises actually run hybrid: domain controllers and file servers on-prem (or in a colo), with the cloud workloads in Azure."}</p>
      </div>
      <div className="sec" id="sha">
        <h3>{"Step 1A.1 — Host Prerequisites"}</h3>
        <p>{"Hyper-V on Windows 11 Pro/Enterprise or Windows Server. Make sure virtualization is enabled in your BIOS (Intel VT-x or AMD-V) and that Hyper-V is installed:"}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"PowerShell (run as admin)"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# Verify CPU supports virtualization"}</span>{"\n"}<span className="km">{"Get-ComputerInfo"}</span>{" "}<span className="kk">{"-Property"}</span>{" HyperV*\n\n"}<span className="kc">{"# Install Hyper-V feature (Windows 11 Pro / Enterprise / Education)"}</span>{"\n"}<span className="km">{"Enable-WindowsOptionalFeature"}</span>{" "}<span className="kk">{"-Online"}</span>{" "}<span className="kk">{"-FeatureName"}</span>{" Microsoft-Hyper-V "}<span className="kk">{"-All"}</span>{" "}<span className="kk">{"-NoRestart"}</span>{"\n\n"}<span className="kc">{"# After reboot, verify"}</span>{"\n"}<span className="km">{"Get-WindowsOptionalFeature"}</span>{" "}<span className="kk">{"-Online"}</span>{" "}<span className="kk">{"-FeatureName"}</span>{" Microsoft-Hyper-V"}</code></pre>
        </div>
        <h4>{"Recommended host resources"}</h4>
        <ul>
          <li><strong>{"CPU:"}</strong>{" 4+ physical cores (8+ logical) — supports 3 concurrent VMs comfortably"}</li>
          <li><strong>{"RAM:"}</strong>{" 32 GB minimum (16 GB for VMs, 16 GB for host)"}</li>
          <li><strong>{"Storage:"}</strong>{" 200 GB free on a dedicated SSD/NVMe drive"}</li>
          <li><strong>{"Networking:"}</strong>{" A wired or stable Wi-Fi connection (you'll be hitting Azure constantly)"}</li>
        </ul>
        <h3>{"Step 1A.2 — Create the Virtual Switch"}</h3>
        <p>{"Use an "}<strong>{"Internal"}</strong>{" virtual switch so your lab VMs can talk to each other and to the host, but stay isolated from your home network (no accidental DHCP conflicts)."}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"Create internal switch"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# Create an internal switch named \"Contoso-LAN\""}</span>{"\n"}<span className="km">{"New-VMSwitch"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'Contoso-LAN'"}</span>{" "}<span className="kk">{"-SwitchType"}</span>{" Internal\n\n"}<span className="kc">{"# Find the matching network adapter on the host"}</span>{"\n"}<span className="km">{"Get-NetAdapter"}</span>{" | "}<span className="km">{"Where-Object"}</span>{" "}<span className="kv">{"{"}</span><span className="kv">{"$_"}</span>{".Name "}<span className="kk">{"-like"}</span>{" "}<span className="ks">{"'*Contoso-LAN*'"}</span><span className="kv">{"}"}</span>{"\n\n"}<span className="kc">{"# Assign a host-side IP in the lab subnet (10.10.1.1 = host gateway for VMs)"}</span>{"\n"}<span className="km">{"New-NetIPAddress"}</span>{" "}<span className="kk">{"-IPAddress"}</span>{" "}<span className="ks">{"'10.10.1.1'"}</span>{" "}<span className="kk">{"-PrefixLength"}</span>{" 24 `\n    "}<span className="kk">{"-InterfaceAlias"}</span>{" "}<span className="ks">{"'vEthernet (Contoso-LAN)'"}</span>{"\n\n"}<span className="kc">{"# Enable Internet sharing so VMs can reach the internet through the host\n# (alternative: use NAT — see ICS / New-NetNat below)"}</span>{"\n"}<span className="km">{"New-NetNat"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'Contoso-NAT'"}</span>{" "}<span className="kk">{"-InternalIPInterfaceAddressPrefix"}</span>{" "}<span className="ks">{"'10.10.1.0/24'"}</span></code></pre>
        </div>
        <div className="ib tip"><b>{"Why Internal + NAT"}</b>{"An External switch would put your DC's DHCP/DNS announcements onto your home network — guaranteed family Wi-Fi drama. Internal + NAT gives the VMs internet access (for Entra Connect, OneDrive, M365) while keeping them invisible to your home LAN."}</div>
      </div>
      <div className="sec" id="shb">
        <h3>{"Step 1A.3 — VM Build Order"}</h3>
        <p>{"Build VMs in this order. Each one will be referenced by later phases of the project."}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"VM Name"}</th>
                <th>{"Role"}</th>
                <th>{"vCPU"}</th>
                <th>{"RAM"}</th>
                <th>{"Disk"}</th>
                <th>{"Static IP"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>{"DC01"}</code></td>
                <td>{"Domain Controller + DNS"}</td>
                <td>{"2"}</td>
                <td>{"4 GB"}</td>
                <td>{"80 GB"}</td>
                <td><code>{"10.10.1.10"}</code></td>
              </tr>
              <tr>
                <td><code>{"FS01"}</code></td>
                <td>{"File Server (FSLogix profiles)"}</td>
                <td>{"2"}</td>
                <td>{"4 GB"}</td>
                <td>{"80 GB + 200 GB data"}</td>
                <td><code>{"10.10.1.20"}</code></td>
              </tr>
              <tr>
                <td><code>{"ENTRA01"}</code></td>
                <td>{"Entra ID Connect server"}</td>
                <td>{"2"}</td>
                <td>{"4 GB"}</td>
                <td>{"80 GB"}</td>
                <td><code>{"10.10.1.30"}</code></td>
              </tr>
              <tr>
                <td><code>{"MGMT01"}</code></td>
                <td>{"Admin workstation (Win 11)"}</td>
                <td>{"2"}</td>
                <td>{"4 GB"}</td>
                <td>{"80 GB"}</td>
                <td><code>{"10.10.1.40"}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4>{"Generation 2 VM creation template"}</h4>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"Create DC01"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# Variables — adjust paths and ISO location to your system"}</span>{"\n"}<span className="kv">{"$vmName"}</span>{"   = "}<span className="ks">{"'DC01'"}</span>{"\n"}<span className="kv">{"$vmPath"}</span>{"   = "}<span className="ks">{"'D:\\Hyper-V\\VMs'"}</span>{"\n"}<span className="kv">{"$vhdPath"}</span>{"  = "}<span className="ks">{"\"$vmPath\\$vmName\\$vmName.vhdx\""}</span>{"\n"}<span className="kv">{"$isoPath"}</span>{"  = "}<span className="ks">{"'D:\\ISOs\\WindowsServer2022.iso'"}</span>{"\n"}<span className="kv">{"$switch"}</span>{"   = "}<span className="ks">{"'Contoso-LAN'"}</span>{"\n\n"}<span className="kc">{"# Create the VM (Generation 2 = UEFI + Secure Boot, required for modern Windows)"}</span>{"\n"}<span className="km">{"New-VM"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="kv">{"$vmName"}</span>{" "}<span className="kk">{"-Generation"}</span>{" 2 "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$vmPath"}</span>{" `\n    "}<span className="kk">{"-NewVHDPath"}</span>{" "}<span className="kv">{"$vhdPath"}</span>{" "}<span className="kk">{"-NewVHDSizeBytes"}</span>{" 80GB `\n    "}<span className="kk">{"-SwitchName"}</span>{" "}<span className="kv">{"$switch"}</span>{" "}<span className="kk">{"-MemoryStartupBytes"}</span>{" 4GB\n\n"}<span className="kc">{"# CPU, dynamic memory, integration services"}</span>{"\n"}<span className="km">{"Set-VM"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="kv">{"$vmName"}</span>{" "}<span className="kk">{"-ProcessorCount"}</span>{" 2 "}<span className="kk">{"-DynamicMemory"}</span>{" `\n    "}<span className="kk">{"-MemoryMinimumBytes"}</span>{" 2GB "}<span className="kk">{"-MemoryMaximumBytes"}</span>{" 6GB `\n    "}<span className="kk">{"-AutomaticStartAction"}</span>{" Start "}<span className="kk">{"-AutomaticStartDelay"}</span>{" 30\n\n"}<span className="kc">{"# Attach the ISO and set boot order (DVD first for install)"}</span>{"\n"}<span className="km">{"Add-VMDvdDrive"}</span>{" "}<span className="kk">{"-VMName"}</span>{" "}<span className="kv">{"$vmName"}</span>{" "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$isoPath"}</span>{"\n"}<span className="kv">{"$dvd"}</span>{" = "}<span className="km">{"Get-VMDvdDrive"}</span>{" "}<span className="kk">{"-VMName"}</span>{" "}<span className="kv">{"$vmName"}</span>{"\n"}<span className="km">{"Set-VMFirmware"}</span>{" "}<span className="kk">{"-VMName"}</span>{" "}<span className="kv">{"$vmName"}</span>{" "}<span className="kk">{"-FirstBootDevice"}</span>{" "}<span className="kv">{"$dvd"}</span>{"\n\n"}<span className="kc">{"# Enable Guest Services (for file copy via Copy-VMFile)"}</span>{"\n"}<span className="km">{"Enable-VMIntegrationService"}</span>{" "}<span className="kk">{"-VMName"}</span>{" "}<span className="kv">{"$vmName"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'Guest Service Interface'"}</span>{"\n\n"}<span className="kc">{"# Start it"}</span>{"\n"}<span className="km">{"Start-VM"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="kv">{"$vmName"}</span></code></pre>
        </div>
        <h4>{"Post-OS-install steps for DC01"}</h4>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Complete Windows Server 2022 install, set local admin password"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Set static IP: "}<code>{"10.10.1.10/24"}</code>{", gateway "}<code>{"10.10.1.1"}</code>{", DNS "}<code>{"127.0.0.1"}</code>{" (it'll become its own DNS)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Rename: "}<code>{"Rename-Computer -NewName DC01 -Restart"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Install AD DS role and promote to first DC in new forest "}<code>{"corp.contoso.local"}</code>{" (same as Step 1.2 in Phase 1)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Repeat the New-VM template above for FS01, ENTRA01, and MGMT01, adjusting the name, IP, and disk size"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Join FS01, ENTRA01, and MGMT01 to "}<code>{"corp.contoso.local"}</code>{" after DC01 is fully promoted"}</div>
          </div>
        </div>
        <h4>{"Checkpoint your VMs after each major milestone"}</h4>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"Checkpoint baseline"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# Snapshot all four VMs at clean-baseline state"}</span>{"\n"}<span className="ks">{"'DC01'"}</span>{","}<span className="ks">{"'FS01'"}</span>{","}<span className="ks">{"'ENTRA01'"}</span>{","}<span className="ks">{"'MGMT01'"}</span>{" | "}<span className="km">{"ForEach-Object"}</span>{" "}<span className="kv">{"{"}</span>{"\n    "}<span className="km">{"Checkpoint-VM"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="kv">{"$_"}</span>{" "}<span className="kk">{"-SnapshotName"}</span>{" "}<span className="ks">{"\"Baseline-$(Get-Date -Format 'yyyyMMdd')\""}</span>{"\n"}<span className="kv">{"}"}</span>{"\n\n"}<span className="kc">{"# If something breaks, restore in seconds:\n# Restore-VMSnapshot -VMName DC01 -Name \"Baseline-20260521\" -Confirm:$false"}</span></code></pre>
        </div>
        <div className="ib tip"><b>{"Production-Like Discipline"}</b>{"Checkpoint before each phase: before Entra Connect install, before joining AVD to the domain, before deploying GPOs. Real cloud engineers and sysadmins don't have this luxury — labbing it teaches you to think about rollback before you change things."}</div>
      </div>
      <div className="sec" id="shc">
        <h3>{"Step 1A.4 — Connect Your Lab to Azure"}</h3>
        <p>{"Your Hyper-V VMs need to reach Azure to: sync identities (Entra Connect), join AVD computers to your on-prem domain, and resolve internal DNS from cloud-side. Two options:"}</p>
        <h4>{"Option 1 — Site-to-Site VPN (closest to production)"}</h4>
        <p>{"A real S2S VPN gateway between your home router and Azure. Most realistic, but requires a router that supports IKEv2 IPsec (Ubiquiti, pfSense, OPNsense, MikroTik, etc.) and a static public IP or DDNS."}</p>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"In Azure: create a Virtual Network Gateway in your "}<code>{"vnet-contoso-azure"}</code>{" (SKU: VpnGw1 — ~$140/mo or use Basic SKU for ~$25/mo lab cost)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Create a Local Network Gateway representing your home network: public IP of your router, address space "}<code>{"10.10.1.0/24"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Create the connection: IPsec, shared key, IKEv2"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Configure your router with matching IPsec settings; verify tunnel comes up"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Test: from a Hyper-V VM, ping the Azure DC IP — should succeed once routing is in place"}</div>
          </div>
        </div>
        <h4>{"Option 2 — Azure VPN Client (easier, point-to-site)"}</h4>
        <p>{"If you don't have an IPsec-capable router, use point-to-site VPN from the Hyper-V host itself. Each VM routes Azure traffic through the host's VPN."}</p>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"In Azure: enable Point-to-site on the VPN gateway, choose Azure AD authentication"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Download the VPN client config to your Hyper-V host"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Install the Azure VPN Client app, import the config, sign in"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"On the Hyper-V host, enable IP forwarding so VMs can reach Azure through the VPN: "}<code>{"Set-NetIPInterface -Forwarding Enabled"}</code></div>
          </div>
        </div>
        <h4>{"Option 3 — Skip the VPN, use Internet-only (simplest for lab)"}</h4>
        <p>{"Entra Connect doesn't actually require a VPN — it makes outbound HTTPS calls to Entra. AVD session hosts in Azure can be domain-joined to your on-prem DC "}<em>{"if"}</em>{" the DC is reachable. Workaround: install Entra Connect on ENTRA01 in Hyper-V (outbound to Entra works), and for the AVD domain-join, use Entra Domain Services in Azure (managed AD) instead of your Hyper-V DC."}</p>
        <div className="ib note"><b>{"Recommended for Most Learners"}</b>{"Start with Option 3 — get Entra Connect working from Hyper-V first. If you want the full hybrid networking experience, layer on Option 1 or 2 once everything else works. Don't tackle VPN complexity until you need it."}</div>
      </div>
      <div className="phase" id="p1">
        <div className="phase-num">{"01"}</div>
        <h2>{"Hybrid Identity — AD + Entra ID"}</h2>
        <p>{"Build the identity foundation. Real enterprises rarely have pure cloud identity — they have on-prem AD that syncs up. Learning this is what separates entry-level from mid-level cloud engineers and sysadmins."}</p>
      </div>
      <div className="sec" id="s11">
        <h3>{"Step 1.1 — Build the On-Premises AD Domain"}</h3>
        <p>{"You'll deploy a single domain controller. If you completed "}<a href="#p1a">{"Phase 1A"}</a>{" you already have "}<code>{"DC01"}</code>{" running in Hyper-V — skip to Step 1.2. If you're going Azure-only, follow the steps below."}</p>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"In Azure, create a resource group "}<code>{"rg-contoso-identity"}</code>{" in your preferred region"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Create a virtual network "}<code>{"vnet-contoso-id"}</code>{" with address space "}<code>{"10.10.0.0/16"}</code>{", subnet "}<code>{"snet-identity (10.10.1.0/24)"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Deploy a Windows Server 2022 VM named "}<code>{"DC01"}</code>{" (Standard_B2ms is fine for lab) with a static private IP "}<code>{"10.10.1.4"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"RDP into DC01, install role: "}<strong>{"Active Directory Domain Services"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Promote to a new forest: "}<code>{"corp.contoso.local"}</code>{", NetBIOS = "}<code>{"CORP"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"After reboot, set the VNet's DNS server to "}<code>{"10.10.1.4"}</code>{" (so future VMs find the domain)"}</div>
          </div>
        </div>
        <h3>{"Step 1.2 — Create an OU Structure"}</h3>
        <p>{"OU design matters because GPOs and Entra Connect filtering target OUs. Use this structure:"}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"AD OU Structure"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# Recommended OU tree — paste into PowerShell on DC01"}</span>{"\n"}<span className="km">{"Import-Module"}</span>{" ActiveDirectory\n\n"}<span className="kv">{"$base"}</span>{" = "}<span className="ks">{"'DC=corp,DC=contoso,DC=local'"}</span>{"\n"}<span className="km">{"New-ADOrganizationalUnit"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'Contoso'"}</span>{" "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$base"}</span>{"\n\n"}<span className="kv">{"$contoso"}</span>{" = "}<span className="ks">{"\"OU=Contoso,$base\""}</span>{"\n"}<span className="km">{"New-ADOrganizationalUnit"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'Users'"}</span>{"    "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$contoso"}</span>{"\n"}<span className="km">{"New-ADOrganizationalUnit"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'Groups'"}</span>{"   "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$contoso"}</span>{"\n"}<span className="km">{"New-ADOrganizationalUnit"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'Computers'"}</span>{" "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$contoso"}</span>{"\n"}<span className="km">{"New-ADOrganizationalUnit"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'Servers'"}</span>{"  "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$contoso"}</span>{"\n"}<span className="km">{"New-ADOrganizationalUnit"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'AVD'"}</span>{"      "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$contoso"}</span>{"\n\n"}<span className="kc">{"# Sub-OUs under Users by department"}</span>{"\n"}<span className="kv">{"$users"}</span>{" = "}<span className="ks">{"\"OU=Users,$contoso\""}</span>{"\n"}<span className="ks">{"'Finance'"}</span>{","}<span className="ks">{"'Marketing'"}</span>{","}<span className="ks">{"'IT'"}</span>{","}<span className="ks">{"'Sales'"}</span>{" | "}<span className="km">{"ForEach-Object"}</span>{" "}<span className="kv">{"{"}</span>{"\n    "}<span className="km">{"New-ADOrganizationalUnit"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="kv">{"$_"}</span>{" "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$users"}</span>{"\n"}<span className="kv">{"}"}</span>{"\n\n"}<span className="kc">{"# AVD-specific OU for host computer accounts"}</span>{"\n"}<span className="km">{"New-ADOrganizationalUnit"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'HostPool-Prod'"}</span>{" "}<span className="kk">{"-Path"}</span>{" "}<span className="ks">{"\"OU=AVD,$contoso\""}</span></code></pre>
        </div>
        <div className="ib tip"><b>{"Why This Matters"}</b>{"Putting AVD computer accounts in their own OU lets you scope AVD-specific GPOs (FSLogix settings, Office SCA registry keys) without polluting general computer policies."}</div>
        <div className="ib warn"><b>{"The CN=Computers Trap — Move Machines After Domain Join"}</b>{"When any machine joins the domain (MGMT01, FS01, ENTRA01, future session hosts), Windows places its computer object in the default "}<code>{"CN=Computers"}</code>{" container by default. "}<strong>{"This container is a CN, not an OU — GPOs cannot be linked to it."}</strong>{" Any GPO you create won't apply to machines stuck there."}<br /><br />{" "}<strong>{"Suggested placement for the lab's machines after they join the domain:"}</strong><br />{" • "}<strong>{"DC01"}</strong>{" → stays in "}<code>{"OU=Domain Controllers"}</code>{" (default — never move DCs)"}<br />{" • "}<strong>{"FS01, ENTRA01"}</strong>{" → "}<code>{"OU=Servers,OU=Contoso"}</code><br />{" • "}<strong>{"MGMT01"}</strong>{" → "}<code>{"OU=Computers,OU=Contoso"}</code>{" (or a new "}<code>{"OU=Workstations"}</code>{")"}<br />{" • "}<strong>{"Future AVD session hosts"}</strong>{" → "}<code>{"OU=HostPool-Prod,OU=AVD,OU=Contoso"}</code>{" (configured automatically by the host pool deployment in Step 5.2)"}<br /><br />{" "}<strong>{"One-time fix to prevent this for all future joins:"}</strong>{" Run "}<code>{"redircmp \"OU=Computers,OU=Contoso,DC=corp,DC=contoso,DC=local\""}</code>{" on DC01 as Domain Admin. After this, every new domain join lands in your real OU instead of "}<code>{"CN=Computers"}</code>{"."}<br /><br />{" See "}<strong>{"Section 5 of the Group Policy Field Guide"}</strong>{" for the full operational workflow including audit queries and batch-move PowerShell."}</div>
      </div>
      <div className="sec" id="s12">
        <h3>{"Step 1.3 — Install Entra Connect Sync"}</h3>
        <p>{"Entra Connect Sync (formerly Azure AD Connect) is the bridge that syncs your on-prem users and groups up to the cloud. It runs on a Windows Server in your domain and pushes changes from AD into Entra ID."}</p>
        <div className="ib note"><b>{"Heads Up — Download Location Changed"}</b>{"Microsoft retired the Microsoft Download Center distribution for Entra Connect Sync. As of version 2.5.3.0 and later (released 2024), the installer is "}<strong>{"only available through the Microsoft Entra admin center"}</strong>{". Older guides and StackOverflow posts pointing to "}<code>{"microsoft.com/download/details.aspx?id=47594"}</code>{" will redirect you to a notice rather than the installer."}</div>
        <h4>{"Step 1.3a — Verify a Custom Domain in Entra"}</h4>
        <p>{"Before installing Entra Connect Sync, the cloud needs to know that you own the domain your users will sign in with. Entra requires DNS-based proof of ownership for any custom domain (anything other than the default "}<code>{"*.onmicrosoft.com"}</code>{")."}</p>
        <p>{"You have two paths here:"}</p>
        <ul>
          <li><strong>{"Path 1 (recommended) — verify a real domain you own."}</strong>{" Gives users professional UPNs like "}<code>{"jdoe@contoso.com"}</code>{" and matches production reality. Worth the 15 minutes."}</li>
          <li><strong>{"Path 2 (lab shortcut) — use only the default "}<code>{"*.onmicrosoft.com"}</code>{" domain."}</strong>{" Faster but means users will have ugly cloud sign-in names like "}<code>{"jdoe@yourtenant.onmicrosoft.com"}</code>{"."}</li>
        </ul>
        <h5>{"Path 1 — Verify a Real Custom Domain"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Sign in to "}<code>{"entra.microsoft.com"}</code>{" with a Global Administrator account"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Navigate to "}<strong>{"Identity → Settings → Domain names"}</strong>{" (in some menu layouts: "}<strong>{"Custom domain names"}</strong>{")"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Click "}<strong>{"Add custom domain"}</strong>{", type your domain (e.g., "}<code>{"contoso.com"}</code>{"), and click "}<strong>{"Add"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Entra displays a "}<strong>{"TXT record"}</strong>{" with a value like "}<code>{"MS=ms12345678"}</code>{". Copy it"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Add the TXT record at the root ("}<code>{"@"}</code>{") of your DNS provider — GoDaddy, Cloudflare, Namecheap, or wherever the domain is registered. Save the record"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Wait 5-30 minutes for DNS propagation. Verify externally with "}<code>{"nslookup -type=TXT contoso.com 8.8.8.8"}</code>{" — you should see your MS=... value returned"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"7"}</div>
            <div className="step-t">{"Back in Entra, click "}<strong>{"Verify"}</strong>{". Domain status changes to "}<strong>{"Verified"}</strong>{" — you can now use it for UPNs"}</div>
          </div>
        </div>
        <div className="ib tip"><b>{"Find Your Tenant's Default Name"}</b>{"If you need it for Path 2 or for reference: Entra portal → "}<strong>{"Overview"}</strong>{" (or click your tenant name in the top-right). Look for "}<strong>{"Primary domain"}</strong>{" — that's your "}<code>{"*.onmicrosoft.com"}</code>{" value. It'll look like "}<code>{"contoso.onmicrosoft.com"}</code>{" or similar. Use the exact spelling shown there."}</div>
        <h4>{"Step 1.3b — Prepare Your AD UPN Suffixes"}</h4>
        <p>{"The Entra Connect Sync wizard checks every UPN suffix registered in your AD forest against the verified domains in your Entra tenant. "}<strong>{"Every UPN suffix that users actually use should match a verified Entra domain"}</strong>{", or those users won't be able to sign in to the cloud."}</p>
        <p>{"First, audit what's actually registered in AD:"}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"PowerShell — On DC01"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# Show all UPN suffixes registered on the forest"}</span>{"\n"}<span className="km">{"Get-ADForest"}</span>{" | "}<span className="km">{"Select-Object"}</span>{" "}<span className="kk">{"-ExpandProperty"}</span>{" UPNSuffixes"}</code></pre>
        </div>
        <p>{"You should see the suffixes you intentionally added. "}<strong>{"If you see typos or suffixes from a previous failed attempt, clean them up before proceeding"}</strong>{" — the wizard will flag them and refuse to map them to anything."}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"PowerShell — Clean up UPN suffixes"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# Remove a bad/typo suffix"}</span>{"\n"}<span className="km">{"Set-ADForest"}</span>{" "}<span className="kk">{"-Identity"}</span>{" ("}<span className="km">{"Get-ADForest"}</span>{").Name "}<span className="kk">{"-UPNSuffixes"}</span>{" "}<span className="kv">{"@{"}</span>{"Remove="}<span className="ks">{"'typo.onmicrosoft.com'"}</span><span className="kv">{"}"}</span>{"\n\n"}<span className="kc">{"# Add the correct suffix matching your verified Entra domain"}</span>{"\n"}<span className="km">{"Set-ADForest"}</span>{" "}<span className="kk">{"-Identity"}</span>{" ("}<span className="km">{"Get-ADForest"}</span>{").Name "}<span className="kk">{"-UPNSuffixes"}</span>{" "}<span className="kv">{"@{"}</span>{"Add="}<span className="ks">{"'contoso.com'"}</span><span className="kv">{"}"}</span>{"\n\n"}<span className="kc">{"# Verify the result"}</span>{"\n("}<span className="km">{"Get-ADForest"}</span>{").UPNSuffixes"}</code></pre>
        </div>
        <p>{"Now update existing AD users to use the proper UPN suffix. New users created after this point can be set to the right suffix in ADUC; existing users need an explicit update:"}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"PowerShell — Bulk update user UPNs"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# On DC01 — bulk update all users in your OU to the new UPN suffix"}</span>{"\n"}<span className="km">{"Get-ADUser"}</span>{" "}<span className="kk">{"-Filter"}</span>{" * "}<span className="kk">{"-SearchBase"}</span>{" "}<span className="ks">{"'OU=Contoso,DC=corp,DC=contoso,DC=local'"}</span>{" |\n    "}<span className="km">{"ForEach-Object"}</span>{" "}<span className="kv">{"{"}</span>{"\n        "}<span className="kv">{"$newUpn"}</span>{" = "}<span className="ks">{"\"$($_.SamAccountName)@contoso.com\""}</span>{"\n        "}<span className="km">{"Set-ADUser"}</span>{" "}<span className="kk">{"-Identity"}</span>{" "}<span className="kv">{"$_"}</span>{" "}<span className="kk">{"-UserPrincipalName"}</span>{" "}<span className="kv">{"$newUpn"}</span>{"\n        "}<span className="km">{"Write-Host"}</span>{" "}<span className="ks">{"\"Updated $($_.SamAccountName) → $newUpn\""}</span>{"\n    "}<span className="kv">{"}"}</span></code></pre>
        </div>
        <div className="ib warn"><b>{"The Forest Root Suffix Can't Be Removed"}</b>{"Your AD forest's root domain name (e.g., "}<code>{"corp.contoso.local"}</code>{") is always registered as a UPN suffix and can't be removed. That's fine — just don't assign users to it. They should all have UPNs ending in your verified custom domain ("}<code>{"contoso.com"}</code>{") instead."}</div>
        <h4>{"Step 1.3c — Download and Install"}</h4>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t"><strong>{"Download the installer from the Entra admin center:"}</strong>{" Sign in to "}<code>{"entra.microsoft.com"}</code>{" → "}<strong>{"Identity"}</strong>{" → "}<strong>{"Hybrid management"}</strong>{" → "}<strong>{"Microsoft Entra Connect"}</strong>{" → "}<strong>{"Connect Sync"}</strong>{" → "}<strong>{"Download Microsoft Entra Connect"}</strong>{". Accept the terms and download. The file is still named "}<code>{"AzureAdConnect.msi"}</code>{" (legacy name kept for compatibility)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Copy the .msi to "}<strong>{"ENTRA01"}</strong>{" (Path A) or DC01 (Path B) and run it — choose "}<strong>{"Express Settings"}</strong>{" for the lab (uses Password Hash Sync). Don't install on a DC in production — it's bad practice"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Authenticate with a "}<strong>{"Hybrid Identity Administrator"}</strong>{" (or Global Administrator) from Entra. Complete the MFA challenge if prompted"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"When prompted for on-prem AD credentials, provide a "}<strong>{"domain account with Enterprise Admins membership"}</strong>{" (the default "}<code>{"Administrator"}</code>{" account in the forest root works — see troubleshooting note below)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"At the "}<strong>{"Microsoft Entra sign-in configuration"}</strong>{" screen, verify all your UPN suffixes show as matched to verified Entra domains (see \"What This Screen Means\" below)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"In "}<strong>{"Domain and OU filtering"}</strong>{", scope to "}<code>{"OU=Contoso"}</code>{" only (don't sync built-in containers)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"7"}</div>
            <div className="step-t">{"Enable "}<strong>{"Password Hash Sync"}</strong>{" and check "}<strong>{"Start the synchronization process"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"8"}</div>
            <div className="step-t">{"After install, verify users appear in Entra: "}<code>{"entra.microsoft.com"}</code>{" → Users — synced users show \"Windows Server AD\" as source"}</div>
          </div>
        </div>
        <h4>{"Understanding the Microsoft Entra Sign-In Configuration Screen"}</h4>
        <p>{"Partway through the wizard, you'll see a screen titled "}<strong>{"Microsoft Entra sign-in configuration"}</strong>{" showing a table of your on-prem AD UPN suffixes vs. the verified domains in your Entra tenant. Each suffix shows either:"}</p>
        <ul>
          <li><strong>{"\"Verified\""}</strong>{" — matches a custom domain you've verified in Entra. Users with this UPN suffix will be able to sign in to the cloud cleanly."}</li>
          <li><strong>{"\"Not Added\""}</strong>{" — no matching verified domain in Entra. Users with this UPN suffix won't be able to authenticate against Entra ID."}</li>
        </ul>
        <p>{"If you completed Steps 1.3a and 1.3b correctly, your real domain ("}<code>{"contoso.com"}</code>{") should show as Verified. Your AD forest root ("}<code>{"corp.contoso.local"}</code>{") will always show as \"Not Added\" because internal AD names can't be verified externally — that's expected and harmless as long as no users are assigned to that suffix."}</p>
        <div className="ib danger"><b>{"Common Issue — \"Not Added\" Warnings on Active Suffixes"}</b>{"If a UPN suffix that users are actually using shows \"Not Added\", do "}<strong>{"not"}</strong>{" check \"Continue without matching all UPN suffixes to verified domains\" and push through. Those users will sync but be unable to sign in. Instead, cancel the wizard, return to Step 1.3a or 1.3b, fix the mismatch, and restart the installer. The wizard re-runs the check fresh each time."}</div>
        <h4>{"Common Errors and Fixes"}</h4>
        <div className="ib warn"><b>{"\"Provided user is not a member of the Enterprise Admins group\""}</b>{"Express Settings creates the AD synchronization account and configures forest-wide replication permissions, which requires "}<strong>{"Enterprise Admins"}</strong>{" (not Domain Admins). The default "}<code>{"Administrator"}</code>{" account in the forest root domain is already a member by default. Fix: provide "}<code>{"DOMAIN\\Administrator"}</code>{" credentials, or temporarily add your admin account to Enterprise Admins on DC01:"}<br /><br />{" "}<code>{"Add-ADGroupMember -Identity \"Enterprise Admins\" -Members \"your.account\""}</code><br /><br />{" After the install completes, remove yourself from Enterprise Admins to restore least privilege. For production, use the Customize path and pre-create the service account with "}<code>{"Set-ADSyncBasicReadPermissions"}</code>{" from the "}<code>{"ADSyncConfig"}</code>{" module instead."}</div>
        <div className="ib warn"><b>{"\"The local domain isn't part of an Entra ID Connect Sync configuration\""}</b>{"Usually means the wizard can't reach Entra. Verify: (1) ENTRA01 has internet access (try browsing "}<code>{"microsoft.com"}</code>{"), (2) DNS on ENTRA01 points to DC01 (not "}<code>{"8.8.8.8"}</code>{" directly — domain members need internal DNS), (3) you signed in to the Entra side of the wizard with a properly licensed account."}</div>
        <div className="ib warn"><b>{"Sync Completes but No Users Appear in Entra"}</b>{"Check the OU filter you set during install — if you scoped to a specific OU and your users are elsewhere in AD, they won't be picked up. Use the "}<strong>{"Synchronization Service Manager"}</strong>{" (Start menu → \"Synchronization Service\") and review the latest sync run's results to see what was filtered out."}</div>
        <div className="ib tip"><b>{"Production Note"}</b>{"For real deployments, use Pass-through Authentication (PTA) + Seamless SSO instead of Password Hash Sync. PHS is fine for the lab and easier to set up. Mention this trade-off in interviews — it shows you understand the options."}</div>
        <div className="ib note"><b>{"The Modern Alternative — Microsoft Entra Cloud Sync"}</b>{"Microsoft is steering eligible customers toward "}<strong>{"Microsoft Entra Cloud Sync"}</strong>{", a lightweight agent-based sync that runs from the cloud instead of on a full-featured on-prem server. It supports most common scenarios (user sync, password hash sync, password writeback) and doesn't require a dedicated server with SQL. For new deployments, evaluate Cloud Sync first — Entra Connect Sync is becoming the legacy option for complex hybrid setups (multi-forest, device writeback, custom extensions). For this lab project, Entra Connect Sync remains the right choice because it gives you broader exposure to the configuration UI and concepts you'll see in interviews."}</div>
      </div>
      <div className="sec" id="s13">
        <h3>{"Step 1.4 — Build the Security Group Strategy"}</h3>
        <p>{"Your group strategy drives "}<em>{"everything"}</em>{": licenses, Conditional Access, Intune assignments, AVD app group access. Get it right once and the rest is easy."}</p>
        <div className="ib danger"><b>{"Licensing Required for Dynamic Groups"}</b>{"Several groups in the table below use "}<strong>{"dynamic membership"}</strong>{" — Entra automatically maintains the member list based on user attributes (department, role, etc.). Dynamic membership is a "}<strong>{"paid feature"}</strong>{" that requires "}<strong>{"Microsoft Entra ID P1 or P2"}</strong>{" for every user who is a member of any dynamic group. The free tier of Entra ID does not support dynamic group rules."}<br /><br />{" For this lab, you have two trial options below. "}<strong>{"Both require a credit card"}</strong>{" and "}<strong>{"both auto-convert to paid subscriptions if not cancelled"}</strong>{" — there is no longer a card-free trial path. Read carefully and turn off recurring billing immediately after starting whichever trial you choose."}</div>
        <h4>{"Two Trial Paths — Both Require a Credit Card"}</h4>
        <p>{"Both trial options now require a credit card for identity verification, and both auto-convert to paid subscriptions if not cancelled in time. The choice between them comes down to "}<strong>{"what you actually need"}</strong>{", not financial safety — neither path is risk-free."}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th />
                <th>{"Microsoft 365 E5 Trial"}<br /><span style={{ fontWeight: "400", textTransform: "none", color: "var(--success)" }}>{"Recommended for this lab"}</span></th>
                <th>{"Entra ID P2 Standalone Trial"}<br /><span style={{ fontWeight: "400", textTransform: "none", color: "var(--ink-muted)" }}>{"Use if you only need P2 features"}</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{"What's included"}</strong></td>
                <td>{"Full E5 stack — Entra ID P2, Intune, Defender for Office/Endpoint, Purview, Power BI Pro, M365 apps"}</td>
                <td>{"Entra ID P2 only (dynamic groups, Conditional Access, PIM, Identity Protection)"}</td>
              </tr>
              <tr>
                <td><strong>{"Duration"}</strong></td>
                <td>{"30 days (one month)"}</td>
                <td>{"30 days"}</td>
              </tr>
              <tr>
                <td><strong>{"Seats"}</strong></td>
                <td>{"25 users"}</td>
                <td>{"100 users"}</td>
              </tr>
              <tr>
                <td><strong>{"Credit card required?"}</strong></td>
                <td><span style={{ color: "var(--danger)", fontWeight: "600" }}>{"Yes"}</span></td>
                <td><span style={{ color: "var(--danger)", fontWeight: "600" }}>{"Yes"}</span>{" (added in 2024 — was previously free)"}</td>
              </tr>
              <tr>
                <td><strong>{"What happens at end of trial"}</strong></td>
                <td><strong>{"Auto-converts to paid subscription"}</strong>{" unless cancelled. Approximately $57/user/month × 25 users = ~$1,425/month"}</td>
                <td><strong>{"Auto-converts to paid subscription"}</strong>{" unless cancelled. $9/user/month × up to 100 users = up to $900/month"}</td>
              </tr>
              <tr>
                <td><strong>{"Best for"}</strong></td>
                <td>{"This lab — you'll use Intune in later phases, Defender for endpoint compliance, and the full stack"}</td>
                <td>{"If you only need P2 features (CA, dynamic groups, PIM) and want more seats"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ib danger"><b>{"Both Trials Auto-Convert — Turn Off Recurring Billing Immediately"}</b>{"Right after starting either trial, navigate to "}<strong>{"Microsoft 365 admin center → Billing → Your products"}</strong>{", select the trial subscription, and "}<strong>{"turn off recurring billing"}</strong>{". This makes the trial expire on its own without converting to a paid plan. Do this on day 1, not day 29 — it's easy to forget. If you don't, Microsoft will charge the payment method on file the moment the trial ends."}<br /><br />{" "}<strong>{"Calendar reminder advice:"}</strong>{" set a reminder for "}<strong>{"day 25"}</strong>{" of the trial as a verification step, even after turning off recurring billing on day 1. Belt and suspenders."}</div>
        <h5>{"How to Start the M365 E5 Trial (Recommended Path)"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Sign in to "}<code>{"admin.microsoft.com"}</code>{" as a Global Administrator"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Navigate to "}<strong>{"Billing → Purchase services → Microsoft 365 → Microsoft 365 E5"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Click "}<strong>{"Start free trial"}</strong>{". Provide a credit card (required) — Microsoft confirms you won't be charged during the 30-day trial"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t"><strong>{"Immediately"}</strong>{" go to "}<strong>{"Billing → Your products"}</strong>{", select the E5 trial, and "}<strong>{"turn off recurring billing"}</strong>{". The subscription will now expire at the end of the trial without auto-renewing"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Set a calendar reminder for day 25 to verify recurring billing is still off and to plan next steps"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Assign E5 licenses to your test users — they now have P2 coverage plus Intune, Defender, and the rest of the stack"}</div>
          </div>
        </div>
        <h5>{"How to Start the Entra ID P2 Trial (If You Only Need P2 Features)"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Sign in to "}<code>{"entra.microsoft.com"}</code>{" as a Global Administrator"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Navigate to "}<strong>{"Identity → Billing → Licenses → All products"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Click "}<strong>{"Try / Buy"}</strong>{" at the top, find "}<strong>{"Microsoft Entra ID P2"}</strong>{", and click "}<strong>{"Free trial"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Provide a credit card when prompted. Microsoft uses it for identity verification — but the trial will still auto-convert to paid if you don't cancel"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t"><strong>{"Immediately"}</strong>{" turn off recurring billing as described above"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Assign the P2 licenses to your test users (or to "}<code>{"GRP-CLOUD-License-P2-Trial"}</code>{" if you use group-based licensing). Users in dynamic groups all need P2 coverage"}</div>
          </div>
        </div>
        <div className="ib tip"><b>{"Why Recommend E5 Over P2 Standalone?"}</b>{"The P2 standalone trial used to be the safer choice because it didn't require a credit card. That changed in 2024 — Microsoft now requires a payment method for both. Given that both trials have the same financial risk profile, "}<strong>{"E5 is the better choice for this lab"}</strong>{" because:"}<br /><br />{" • You'll use "}<strong>{"Intune"}</strong>{" in Phase 5 for endpoint management — included in E5, not P2"}<br />{" • You'll use "}<strong>{"Conditional Access with device compliance"}</strong>{" — needs both Entra P2 AND Intune"}<br />{" • "}<strong>{"Defender for Endpoint"}</strong>{" integration is part of the realistic AVD security story"}<br />{" • You get full M365 productivity apps for your test users"}<br /><br />{" If you only want to explore dynamic groups, Conditional Access, and PIM without the rest, P2 standalone is still valid — but for this lab, E5 covers everything you need."}</div>
        <div className="ib note"><b>{"Not All Groups Are Required for the Lab"}</b>{"The table below lists nine groups, but you don't need to create all of them to complete the lab. Three are "}<strong>{"core requirements"}</strong>{", two are "}<strong>{"recommended"}</strong>{", and four are "}<strong>{"demonstrative extras"}</strong>{" included to teach concepts you'll see in real environments. Start with the core groups, add the recommended ones if you're doing the full project, and only create the extras if you want to practice those specific concepts."}</div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Group Name"}</th>
                <th>{"Type"}</th>
                <th>{"Role-Assignable?"}</th>
                <th>{"Needed for Lab?"}</th>
                <th>{"Purpose"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>{"GRP-AD-AVD-Users"}</code></td>
                <td>{"Assigned"}</td>
                <td>{"No"}</td>
                <td><strong style={{ color: "var(--success)" }}>{"Core"}</strong></td>
                <td>{"Members get AVD application group access — required in Phase 4"}</td>
              </tr>
              <tr>
                <td><code>{"GRP-CLOUD-CA-Excluded"}</code></td>
                <td>{"Assigned"}</td>
                <td>{"No"}</td>
                <td><strong style={{ color: "var(--success)" }}>{"Core"}</strong></td>
                <td>{"Break-glass accounts excluded from all CA policies — critical for safety"}</td>
              </tr>
              <tr>
                <td><code>{"GRP-CLOUD-License-E5"}</code></td>
                <td>{"Assigned"}</td>
                <td>{"No"}</td>
                <td><strong style={{ color: "var(--success)" }}>{"Core"}</strong></td>
                <td>{"Group-based licensing for M365 E5 — required if using group-based licensing in Phase 2"}</td>
              </tr>
              <tr>
                <td><code>{"GRP-CLOUD-All-Users"}</code></td>
                <td>{"Dynamic"}</td>
                <td>{"No"}</td>
                <td><strong style={{ color: "var(--accent)" }}>{"Recommended"}</strong></td>
                <td>{"Every active user — base CA policies, Intune autopilot. Cleaner than the built-in \"All users\" target"}</td>
              </tr>
              <tr>
                <td><code>{"GRP-CLOUD-Pilot-Activation-Fix"}</code></td>
                <td>{"Assigned"}</td>
                <td>{"No"}</td>
                <td><strong style={{ color: "var(--accent)" }}>{"Recommended"}</strong></td>
                <td>{"Pilot users for the auto-remediation in Phase 6 — only needed if you complete that phase"}</td>
              </tr>
              <tr>
                <td><code>{"GRP-CLOUD-Dept-Finance"}</code></td>
                <td>{"Dynamic"}</td>
                <td>{"No"}</td>
                <td><span style={{ color: "var(--ink-muted)" }}>{"Extra"}</span></td>
                <td>{"Demonstrates dynamic membership with department -eq \"Finance\" — teaches the concept, not required to finish the lab"}</td>
              </tr>
              <tr>
                <td><code>{"GRP-CLOUD-Role-GlobalAdmins"}</code></td>
                <td>{"Assigned"}</td>
                <td><strong>{"Yes"}</strong></td>
                <td><span style={{ color: "var(--ink-muted)" }}>{"Extra"}</span></td>
                <td>{"Demonstrates role-assignable groups — create if you want to practice the pattern"}</td>
              </tr>
              <tr>
                <td><code>{"GRP-CLOUD-Role-Helpdesk"}</code></td>
                <td>{"Assigned"}</td>
                <td><strong>{"Yes"}</strong></td>
                <td><span style={{ color: "var(--ink-muted)" }}>{"Extra"}</span></td>
                <td>{"Demonstrates role-assignable groups for delegated administration"}</td>
              </tr>
              <tr>
                <td><code>{"GRP-CLOUD-Role-UserAdmins"}</code></td>
                <td>{"Assigned"}</td>
                <td><strong>{"Yes"}</strong></td>
                <td><span style={{ color: "var(--ink-muted)" }}>{"Extra"}</span></td>
                <td>{"Demonstrates role-assignable groups for user lifecycle management"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ib tip"><b>{"The Minimum Viable Lab Path"}</b>{"If you want the fastest path to a working AVD environment, create just the three "}<strong>{"Core"}</strong>{" groups: "}<code>{"GRP-AD-AVD-Users"}</code>{", "}<code>{"GRP-CLOUD-CA-Excluded"}</code>{", and "}<code>{"GRP-CLOUD-License-E5"}</code>{". Manually populate them with your test users. The lab will function end-to-end. You can add the Recommended and Extra groups later as you explore Conditional Access design, dynamic membership, and role-assignable group patterns."}</div>
        <h4>{"Dynamic Membership Rules — Required for Dynamic Groups"}</h4>
        <p>{"When you create a dynamic group, Entra requires you to define a "}<strong>{"membership rule"}</strong>{" — a query expression that evaluates user (or device) attributes and decides who belongs. Without a rule, the group has no members. Two dynamic groups exist in the strategy above, and each needs its own rule."}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Group"}</th>
                <th>{"Membership Rule"}</th>
                <th>{"Why This Rule"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>{"GRP-CLOUD-All-Users"}</code></td>
                <td><code>{"(user.accountEnabled -eq true) -and (user.userType -eq \"Member\")"}</code></td>
                <td>{"Includes every enabled internal user; excludes disabled accounts (offboarded users) and guests (B2B collaborators). This is the standard \"all real, active employees\" filter"}</td>
              </tr>
              <tr>
                <td><code>{"GRP-CLOUD-Dept-Finance"}</code></td>
                <td><code>{"(user.department -eq \"Finance\") -and (user.accountEnabled -eq true)"}</code></td>
                <td>{"Includes only enabled users whose "}<code>{"department"}</code>{" attribute matches \"Finance\" exactly. Adding the "}<code>{"accountEnabled"}</code>{" check prevents disabled accounts from receiving licenses or app access"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h5>{"The Building Blocks of Dynamic Rules"}</h5>
        <p>{"Rules use a specific syntax — not PowerShell, not SQL. The pattern is "}<code>{"(property operator \"value\")"}</code>{", joined with "}<code>{"-and"}</code>{", "}<code>{"-or"}</code>{", and "}<code>{"-not"}</code>{". Common building blocks:"}</p>
        <ul>
          <li><strong>{"Identity filters:"}</strong>{" "}<code>{"user.accountEnabled"}</code>{", "}<code>{"user.userType"}</code>{" (\"Member\" vs \"Guest\"), "}<code>{"user.objectId"}</code></li>
          <li><strong>{"Organizational filters:"}</strong>{" "}<code>{"user.department"}</code>{", "}<code>{"user.jobTitle"}</code>{", "}<code>{"user.companyName"}</code>{", "}<code>{"user.country"}</code>{", "}<code>{"user.city"}</code>{", "}<code>{"user.officeLocation"}</code></li>
          <li><strong>{"Contact filters:"}</strong>{" "}<code>{"user.mail"}</code>{", "}<code>{"user.userPrincipalName"}</code>{", "}<code>{"user.otherMails"}</code></li>
          <li><strong>{"Membership filters:"}</strong>{" "}<code>{"user.memberOf -any (group.objectId -eq \"...\")"}</code>{" — nested membership"}</li>
          <li><strong>{"Operators:"}</strong>{" "}<code>{"-eq"}</code>{", "}<code>{"-ne"}</code>{", "}<code>{"-startsWith"}</code>{", "}<code>{"-contains"}</code>{", "}<code>{"-match"}</code>{" (regex), "}<code>{"-in"}</code>{" (list match)"}</li>
        </ul>
        <h5>{"Three Rules Worth Knowing for Real Environments"}</h5>
        <p>{"Beyond the lab, these patterns come up constantly:"}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Use Case"}</th>
                <th>{"Rule"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"All guests in the tenant"}</td>
                <td><code>{"user.userType -eq \"Guest\""}</code></td>
              </tr>
              <tr>
                <td>{"All US-based employees"}</td>
                <td><code>{"(user.country -eq \"United States\") -and (user.accountEnabled -eq true)"}</code></td>
              </tr>
              <tr>
                <td>{"Multiple departments at once"}</td>
                <td><code>{"user.department -in [\"Finance\", \"Accounting\", \"Legal\"]"}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ib warn"><b>{"Attribute Population Is on You"}</b>{"Dynamic rules only work if the attributes they reference are "}<strong>{"actually populated"}</strong>{" on user objects. "}<code>{"department"}</code>{", "}<code>{"jobTitle"}</code>{", and "}<code>{"country"}</code>{" are blank by default — someone has to set them, either in on-prem AD (and let Entra Connect Sync push them up) or in Entra directly. For the lab, set "}<code>{"department = \"Finance\""}</code>{" on a test user before expecting "}<code>{"GRP-CLOUD-Dept-Finance"}</code>{" to find them. In production, HR-to-AD attribute provisioning (via SuccessFactors, Workday, etc.) usually owns this responsibility."}</div>
        <div className="ib tip"><b>{"Test Rules Before Saving"}</b>{"The Entra portal has a built-in rule validator: "}<strong>{"Groups → New group → Dynamic User → Add dynamic query → Validate Rules"}</strong>{". Paste in a few test user UPNs and Entra tells you which would match. Use this to confirm a rule does what you intended before saving the group."}</div>
        <p>{"Create these as "}<strong>{"Microsoft 365 groups"}</strong>{" if they need a mailbox, or "}<strong>{"Security groups"}</strong>{" otherwise. For AVD specifically, you'll create groups in AD (synced up to Entra by Entra Connect Sync) so they can be applied to both GPO and Intune."}</p>
        <h4>{"The Two-Layer Group Model — Cloud vs. AD Groups"}</h4>
        <p>{"In a hybrid environment, groups live in one of two places, and the choice has real consequences for how you manage them. The convention used in this guide makes the source obvious at a glance:"}</p>
        <div className="split">
          <div className="split-title">{"The Naming Convention"}</div>
          <div className="split-grid">
            <div className="split-side a">
              <div className="split-side-title">{"GRP-AD-* (AD-sourced)"}</div>
              <div className="split-side-body">{"Lives in on-prem Active Directory. Created in ADUC or via PowerShell on a DC. Syncs "}<strong>{"up"}</strong>{" to Entra via Entra Connect Sync."}<br /><br />{" "}<strong>{"Used for:"}</strong>{" GPO scoping, file share permissions, anything that needs to work both in AD and Entra."}<br /><br />{" "}<strong>{"Modified in:"}</strong>{" AD only. Edits in the Entra portal fail with errors because Entra treats synced groups as read-only."}</div>
            </div>
            <div className="split-side b">
              <div className="split-side-title">{"GRP-CLOUD-* (Entra-only)"}</div>
              <div className="split-side-body">{"Lives only in Microsoft Entra ID. Created in the Entra portal or via Microsoft Graph. Never touches on-prem AD."}<br /><br />{" "}<strong>{"Used for:"}</strong>{" Conditional Access targeting, Intune assignments, license assignment, role-assignable groups, dynamic membership."}<br /><br />{" "}<strong>{"Modified in:"}</strong>{" Entra portal or Graph API only. Cannot be used for GPO scoping or on-prem file permissions."}</div>
            </div>
          </div>
        </div>
        <h5>{"Why This Distinction Matters"}</h5>
        <p>{"Without a naming convention that signals the source, you'll inevitably try to modify a synced AD group in the Entra portal and hit a confusing \"this group is managed on-premises\" error. Or you'll try to use an Entra-only group for a GPO and discover GPO can't see it. The convention prevents both mistakes."}</p>
        <h5>{"How to Decide Which Type to Create"}</h5>
        <p>{"Ask one question: "}<strong>{"Does the group need to exist in on-prem AD for any reason?"}</strong></p>
        <ul>
          <li><strong>{"Yes (use GRP-AD-*):"}</strong>{" The group will be referenced in GPO Restricted Groups, used for file share NTFS permissions, used by on-prem applications that authenticate against AD, or needs to control access to anything that exists before the cloud sync ran."}</li>
          <li><strong>{"No (use GRP-CLOUD-*):"}</strong>{" The group will only be referenced by cloud services — Conditional Access, Intune, license assignment, AVD application groups, SaaS apps via Entra SSO, or Microsoft Graph automation."}</li>
        </ul>
        <p>{"When in doubt, prefer cloud-only. Cloud-native groups support features AD groups don't (dynamic membership, role-assignable status, license assignment) and they're easier to manage at scale."}</p>
        <div className="ib tip"><b>{"Why GRP-AD-AVD-Users is the Exception"}</b>{"The only AD-sourced group in this lab is "}<code>{"GRP-AD-AVD-Users"}</code>{". It's AD-sourced because the lab demonstrates adding users to it via on-prem ADUC (showing the sync flow). In a real environment, you'd more likely make this a cloud-only group since AVD is entirely a cloud service — there's no on-prem dependency that requires AD as the source. The choice here is pedagogical, not architectural."}</div>
        <h5>{"Do Users Need a License for the Entra Dashboard to \"Show\" Them?"}</h5>
        <p>{"A common point of confusion: "}<strong>{"users sync to Entra and appear in the portal whether or not they have a license"}</strong>{". Once Entra Connect Sync runs, every synced user shows up in "}<code>{"entra.microsoft.com → Users"}</code>{" with source \"Windows Server AD\". No license required for visibility."}</p>
        <p>{"But for users to actually "}<em>{"do anything"}</em>{", they need appropriate licenses. The chain works like this:"}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"What You Want"}</th>
                <th>{"License Required"}</th>
                <th>{"Which Users Need It"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"User appears in Entra portal"}</td>
                <td>{"None"}</td>
                <td>{"None — sync alone is enough"}</td>
              </tr>
              <tr>
                <td>{"User can sign in to Entra"}</td>
                <td>{"None"}</td>
                <td>{"None — basic sign-in is free"}</td>
              </tr>
              <tr>
                <td>{"User is member of a dynamic group"}</td>
                <td>{"P1 minimum"}</td>
                <td>{"Every member of the dynamic group"}</td>
              </tr>
              <tr>
                <td>{"User affected by Conditional Access"}</td>
                <td>{"P1 minimum"}</td>
                <td>{"Every user targeted by a CA policy"}</td>
              </tr>
              <tr>
                <td>{"User using PIM, Identity Protection"}</td>
                <td>{"P2"}</td>
                <td>{"Only the admin accounts using PIM"}</td>
              </tr>
              <tr>
                <td>{"User accessing AVD session host"}</td>
                <td>{"AVD-eligible (M365 E3/E5/F3, Business Premium, Windows E3/E5, etc.)"}</td>
                <td>{"Every AVD user"}</td>
              </tr>
              <tr>
                <td>{"User using Intune-managed devices"}</td>
                <td>{"Intune license"}</td>
                <td>{"Every user with managed devices"}</td>
              </tr>
              <tr>
                <td>{"User using Outlook, Teams, OneDrive"}</td>
                <td>{"M365 license (E3, E5, Business)"}</td>
                <td>{"Every productivity user"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ib note"><b>{"What This Means for the Lab"}</b>{"Assign E5 (or your trial equivalent) to every test user who will actually connect to AVD or test M365 features. You don't need to license every user in your tenant — only the ones actively testing. Break-glass accounts in "}<code>{"GRP-CLOUD-CA-Excluded"}</code>{" don't need licenses (they exist for emergency tenant access, not productivity). Service accounts don't need licenses unless they're using a licensed service."}</div>
        <div className="ib warn"><b>{"AVD Has a License Trap"}</b>{"For AVD specifically, users need one of a specific list of \"AVD-eligible\" licenses or the service rejects their connection — even if everything else is configured correctly. Eligible licenses include: Microsoft 365 E3/E5/A3/A5/F3/Business Premium, Windows 10/11 Enterprise E3/E5 (per-user), or Windows VDA E3/E5. Without one of these on the user, AVD will fail to connect with a generic licensing error. Always license users "}<em>{"before"}</em>{" trying to test AVD connectivity."}</div>
        <div className="ib note"><b>{"Assigned Groups Don't Need P1/P2"}</b>{"The licensing requirement applies only to groups using "}<strong>{"dynamic membership rules"}</strong>{". Groups marked as "}<strong>{"Assigned"}</strong>{" in the table (manual membership) work on the free Entra ID tier. If you want to skip the trial entirely, you can manually populate every group — you'll lose the automation benefit but the lab still functions."}</div>
        <h4>{"The \"Microsoft Entra Roles Can Be Assigned to the Group\" Option"}</h4>
        <p>{"When you create a group in Entra, you'll see a toggle labeled "}<strong>{"\"Microsoft Entra roles can be assigned to the group\""}</strong>{". This setting determines whether the group can be used to grant Entra directory roles (Global Admin, Helpdesk Admin, User Admin, etc.) to its members. Most documentation glosses over what this option actually does and when to use it — here's the full picture."}</p>
        <h5>{"What It Does"}</h5>
        <p>{"When enabled, the group becomes a "}<strong>{"role-assignable group"}</strong>{". You can assign Entra directory roles to the group itself, and every member inherits those role permissions automatically. Remove a user from the group, and their role permissions disappear without manual cleanup."}</p>
        <p>{"Example: "}<code>{"GRP-CLOUD-Role-Helpdesk"}</code>{" is assigned the Helpdesk Administrator role. Add a new help desk hire to the group → they instantly have Helpdesk Admin permissions. Remove them on their last day → permissions revoked immediately."}</p>
        <h5>{"Three Critical Differences from Regular Groups"}</h5>
        <ul>
          <li><strong>{"Permanent and one-way."}</strong>{" Once enabled, this setting cannot be turned off. The group is locked into role-assignable status for its entire lifetime. Microsoft does this intentionally to prevent privilege-escalation tricks where attackers convert protected groups into regular groups to bypass restrictions."}</li>
          <li><strong>{"Restricted membership management."}</strong>{" Only "}<strong>{"Global Administrators"}</strong>{", "}<strong>{"Privileged Role Administrators"}</strong>{", or the group's explicit owners can add or remove members. Group Administrators and User Administrators — who can normally manage groups — cannot touch role-assignable groups. This protects the group from being modified by lower-privileged admins."}</li>
          <li><strong>{"Requires P1 or P2."}</strong>{" Like dynamic groups, this is a paid Entra feature."}</li>
        </ul>
        <h5>{"When to Enable It — And When Not To"}</h5>
        <p>{"The rule is simple: "}<strong>{"enable this option only for groups that will actually receive Entra directory role assignments"}</strong>{". Examples from the table above:"}</p>
        <ul>
          <li><strong>{"Enable for:"}</strong>{" "}<code>{"GRP-CLOUD-Role-GlobalAdmins"}</code>{", "}<code>{"GRP-CLOUD-Role-Helpdesk"}</code>{", "}<code>{"GRP-CLOUD-Role-UserAdmins"}</code>{", or any other group whose purpose is granting Entra directory roles."}</li>
          <li><strong>{"Do NOT enable for:"}</strong>{" "}<code>{"GRP-CLOUD-All-Users"}</code>{" (just a membership grouping), "}<code>{"GRP-CLOUD-License-E5"}</code>{" (license assignment, not roles), "}<code>{"GRP-AD-AVD-Users"}</code>{" (app group access, not roles), "}<code>{"GRP-CLOUD-CA-Excluded"}</code>{" (CA policy targeting, not roles), "}<code>{"GRP-CLOUD-Dept-Finance"}</code>{" (dynamic membership + app access)."}</li>
        </ul>
        <div className="ib warn"><b>{"The \"Future-Proofing\" Trap"}</b>{"Some admins enable this option on every group as a \"just in case\" measure. This is a mistake for two reasons:"}<br /><br />{" "}<strong>{"1. You lock yourself out of normal delegation."}</strong>{" A help desk admin who should be able to add users to "}<code>{"GRP-CLOUD-Dept-Finance"}</code>{" for testing now can't — only Global Admins can modify role-assignable groups. You either escalate every routine membership change or grant the help desk more privilege than they should have."}<br /><br />{" "}<strong>{"2. You've inflated your privileged group count."}</strong>{" Security tools and auditors look at how many role-assignable groups exist in a tenant — too many is a red flag. Every role-assignable group is a potential privilege-escalation target. Keep the list small and intentional."}</div>
        <div className="ib tip"><b>{"The Correct Pattern"}</b>{"Create "}<strong>{"separate groups"}</strong>{" for role assignment vs. everything else:"}<br /><br />{" • Small, tightly controlled role-assignable groups ("}<code>{"GRP-CLOUD-Role-*"}</code>{") containing IT admins only"}<br />{" • Regular non-role-assignable groups for license assignment, Conditional Access targeting, app access, dynamic membership, and everything else"}<br /><br />{" Use the role-assignable groups specifically to assign Entra roles — and use the regular groups for everything else. This pattern gives you clean privilege boundaries and keeps day-to-day membership changes manageable by mid-level admins."}</div>
        <div className="ib note"><b>{"Why Role-Assignable Groups Beat Direct Role Assignment"}</b>{"You "}<em>{"can"}</em>{" assign Entra roles directly to individual users without a group. But group-based role assignment has three big advantages:"}<br /><br />{" "}<strong>{"Faster onboarding/offboarding."}</strong>{" New help desk hire → add to "}<code>{"GRP-CLOUD-Role-Helpdesk"}</code>{" → done. They have permissions in seconds. On their last day, remove from the group → permissions revoked."}<br /><br />{" "}<strong>{"Audit clarity."}</strong>{" \"Who has Helpdesk Admin?\" — look at the group members. Single source of truth instead of reviewing each user's assigned roles individually."}<br /><br />{" "}<strong>{"Reduced direct assignments."}</strong>{" Direct user-to-role assignments scatter across the tenant and become hard to audit. Group-based assignments centralize the privilege model."}</div>
        <h4>{"Should Groups Have Owners Assigned?"}</h4>
        <p>{"Most documentation skips this question, but it matters for both daily operations and long-term hygiene. The short answer: "}<strong>{"yes, almost always — and you should add at least two owners to every group you create"}</strong>{"."}</p>
        <h5>{"What Owners Actually Do"}</h5>
        <p>{"A group owner has delegated rights to manage that specific group without needing tenant-wide administrative roles. Owners can:"}</p>
        <ul>
          <li>{"Add and remove members from the group (except dynamic groups, where rules govern membership)"}</li>
          <li>{"Modify the group's properties (name, description, settings)"}</li>
          <li>{"Approve or deny join requests for groups with that feature enabled"}</li>
          <li>{"Delete the group entirely"}</li>
          <li>{"Configure expiration policies and access reviews on the group"}</li>
        </ul>
        <p>{"The key concept: "}<strong>{"owners delegate group management without requiring elevated tenant roles"}</strong>{". A team lead who needs to manage their team's group membership doesn't need to be a Groups Administrator — they just need to be an owner of that specific group."}</p>
        <h5>{"Three Problems Owners Solve"}</h5>
        <ul>
          <li><strong>{"The orphaned group problem."}</strong>{" Without owners, when the admin who created a group leaves, no one knows what it's for or whether it's still needed. Tenants accumulate dozens of orphaned groups over time — a security risk and audit nightmare. With owners assigned, you can see who's accountable and either reassign or remove them when someone leaves."}</li>
          <li><strong>{"The help desk bottleneck problem."}</strong>{" Without owners, every membership change goes through someone with the Groups Administrator role. Team lead wants to add a new hire? File a ticket. With owners delegated to the team lead, they manage their own group membership in seconds via the Entra portal."}</li>
          <li><strong>{"The audit trail problem."}</strong>{" When auditors ask \"who's responsible for this group?\", the answer with owners is \"Jane in Marketing.\" Without owners, the answer is \"anyone with Groups Admin\" — meaning the entire IT team is implicated for every group decision."}</li>
        </ul>
        <h5>{"When Owners Are Required vs. Optional"}</h5>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Group Type"}</th>
                <th>{"Owners Required?"}</th>
                <th>{"Notes"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{"Microsoft 365 group"}</strong></td>
                <td>{"Yes — at least one required"}</td>
                <td>{"Microsoft enforces this to prevent orphans"}</td>
              </tr>
              <tr>
                <td><strong>{"Security group (Assigned)"}</strong></td>
                <td>{"No — but strongly recommended"}</td>
                <td>{"Optional but considered best practice"}</td>
              </tr>
              <tr>
                <td><strong>{"Security group (Dynamic)"}</strong></td>
                <td>{"No — but strongly recommended"}</td>
                <td>{"Owners can't modify membership (rules do that) but can manage other properties"}</td>
              </tr>
              <tr>
                <td><strong>{"Distribution group"}</strong></td>
                <td>{"Yes — Exchange enforces it"}</td>
                <td>{"Email lists need someone accountable"}</td>
              </tr>
              <tr>
                <td><strong>{"Mail-enabled security group"}</strong></td>
                <td>{"Yes — Exchange enforces it"}</td>
                <td>{"Same as distribution groups"}</td>
              </tr>
              <tr>
                <td><strong>{"Role-assignable group"}</strong></td>
                <td>{"No, but "}<strong>{"especially valuable here"}</strong></td>
                <td>{"Otherwise only Global Admins and Privileged Role Admins can modify membership"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ib tip"><b>{"Role-Assignable Groups Need Owners Most"}</b>{"Recall from the role-assignable section above — these groups can only be modified by Global Administrators, Privileged Role Administrators, or "}<strong>{"owners"}</strong>{". If you don't assign owners, the only people who can modify the group are tenant-wide privileged admins. That forces unnecessary privilege escalation for routine membership changes. Assigning owners (typically the senior identity admins) lets routine management happen without elevating to Global Admin."}</div>
        <h5>{"Owner Selection Patterns"}</h5>
        <p>{"Three common patterns for who to assign as owners, each with trade-offs:"}</p>
        <ul>
          <li><strong>{"Functional owner."}</strong>{" The person responsible for the team or function the group serves — e.g., the Finance Director owns "}<code>{"GRP-CLOUD-Dept-Finance"}</code>{". Pros: clear accountability, business-aligned. Cons: depends on the person staying in the role."}</li>
          <li><strong>{"IT service owner."}</strong>{" A specific IT staff member or team owns the group — e.g., the Identity Team owns all role-assignable groups. Pros: consistent management practices. Cons: doesn't solve the help desk bottleneck."}</li>
          <li><strong>{"Service principal / automation."}</strong>{" An automation account owns the group, and a workflow (Power Automate, Graph script) manages membership programmatically. Pros: automated, scales infinitely. Cons: requires automation infrastructure."}</li>
        </ul>
        <p>{"Most mature organizations use a mix: functional owners for department/business groups, IT service owners for infrastructure groups, automation for high-volume or compliance-driven groups."}</p>
        <h5>{"Owners vs. Members — Don't Confuse Them"}</h5>
        <p>{"A common point of confusion: "}<strong>{"being an owner does not make you a member"}</strong>{". If a group grants access to a SharePoint site, the owner doesn't get that access unless they're also added as a member. A manager who owns a Finance group can manage who's in it but can't see the Finance documents themselves without being explicitly added."}</p>
        <p>{"Microsoft 365 groups have a setting called \"Owners can also be members\" that's usually enabled by default — it adds owners as members automatically. For security groups, ownership and membership are completely separate."}</p>
        <h5>{"How Many Owners?"}</h5>
        <p>{"Microsoft's guidance and most enterprise patterns:"}</p>
        <ul>
          <li><strong>{"Minimum: 2 owners per group"}</strong>{" — so one person leaving doesn't orphan the group"}</li>
          <li><strong>{"Practical max: 5 owners"}</strong>{" — more than this and accountability dissolves"}</li>
          <li><strong>{"For automation-managed groups:"}</strong>{" 1 service principal + 1 human backup"}</li>
        </ul>
        <p>{"Two owners is the sweet spot for most cases. One is the primary; the second is the backup or co-owner."}</p>
        <div className="ib warn"><b>{"For Your Lab Specifically"}</b>{"You're the only admin in this lab. Add yourself as the owner of every group you create. In production, you'd assign at least two owners — the primary responsible party and a backup. For your "}<code>{"GRP-CLOUD-Role-*"}</code>{" groups especially, owners are critical: without them, you'd need to be a Global Admin every time you want to modify the group, which contradicts the least-privilege model the role-assignable pattern is trying to build."}</div>
        <div className="ib note"><b>{"A Pattern Worth Adopting"}</b>{"Treat group ownership as a first-class concern from day one:"}<br /><br />{" • Never create a group without at least one owner. Make this a habit."}<br />{" • Use owners as the audit trail — when you see a group, you should be able to identify who's responsible."}<br />{" • Enable group expiration policies for non-critical groups — forces owners to renew, automatically archives orphans."}<br />{" • For role-assignable groups specifically, always have multiple owners. Single point of failure on a privileged group is bad."}</div>
      </div>
      <div className="phase" id="p2">
        <div className="phase-num">{"02"}</div>
        <h2>{"Microsoft 365 — Productivity Foundation"}</h2>
        <p>{"Licensing strategy, Outlook configuration, and OneDrive Known Folder Move. These are the productivity pillars users actually care about."}</p>
      </div>
      <div className="sec" id="s21">
        <h3>{"Step 2.1 — License Strategy"}</h3>
        <p>{"Use "}<strong>{"group-based licensing"}</strong>{", not direct assignment. When someone joins or leaves a department group, their license flows automatically."}</p>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"In Entra: Groups → "}<code>{"GRP-CLOUD-License-E5"}</code>{" → Licenses → Assignments → add Microsoft 365 E5"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Set the included services: Exchange Online, SharePoint, OneDrive, Teams, M365 Apps for Enterprise, Defender, Intune. Disable services you don't need (Yammer, Sway)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Verify a synced user inherits the license — group-based licensing is "}<strong>{"asynchronous"}</strong>{" and typically completes within a few minutes (Users → user → Licenses). Under heavy tenant load it can take longer; Microsoft considers up to 24 hours a normal range before opening a support case"}</div>
          </div>
        </div>
        <div className="ib warn"><b>{"Critical for AVD"}</b>{"Microsoft 365 Apps for Enterprise must be in the license bundle — that's the SKU that supports Shared Computer Activation. Business Standard does NOT support SCA on multi-session AVD."}</div>
      </div>
      <div className="sec" id="s22">
        <h3>{"Step 2.2 — Outlook & Exchange Online"}</h3>
        <p>{"Once a user is licensed, their mailbox provisions automatically — typically within a few minutes, but anywhere from a few minutes to a few hours is normal. Microsoft's documented range for first-time mailbox provisioning is up to 24 hours under load. Verify and configure:"}</p>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"In Exchange admin center ("}<code>{"admin.exchange.microsoft.com"}</code>{"): Recipients → Mailboxes — confirm user appears"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Verify the tenant's data residency: "}<strong>{"Microsoft 365 admin center → Settings → Org settings → Organization profile → Data location"}</strong>{". This is set at tenant signup based on the country you chose and is "}<strong>{"not changeable"}</strong>{" without a Microsoft-led migration. For Multi-Geo tenants (E5 + Multi-Geo add-on), per-user mailbox placement is controlled via the "}<code>{"PreferredDataLocation"}</code>{" attribute through Microsoft Graph or PowerShell — not through any portal UI"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Configure email retention in the "}<strong>{"Microsoft Purview compliance portal"}</strong>{" ("}<code>{"compliance.microsoft.com"}</code>{"): "}<strong>{"Solutions → Data Lifecycle Management → Microsoft 365 → Retention policies"}</strong>{". Click "}<strong>{"New retention policy"}</strong>{", name it \"Default 7 Year Retention\". When prompted to choose a scope, select "}<strong>{"Static"}</strong>{" (not Adaptive) — Adaptive scopes target users via dynamic queries and "}<strong>{"only support a limited set of locations"}</strong>{"; selecting Adaptive grays out Exchange mailboxes, SharePoint, and most other M365 workloads. Static is what you need for a simple \"apply to everyone in Exchange\" policy. Set retention duration to 7 years"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Enable Outlook on the Web for all licensed users (default, but verify in Mailbox Policies)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"For AVD specifically: enable "}<strong>{"Outlook Cached Mode with a small cache window"}</strong>{" (3–6 months) via GPO to keep FSLogix profile sizes manageable"}</div>
          </div>
        </div>
      </div>
      <div className="sec" id="s23">
        <h3>{"Step 2.3 — OneDrive Known Folder Move (KFM)"}</h3>
        <p>{"KFM redirects Desktop, Documents, and Pictures to OneDrive. Essential for AVD because user data must roam between session hosts."}</p>
        <h4>{"Get your tenant ID"}</h4>
        <p>{"You'll need this for the GPO setting. Find it at "}<code>{"entra.microsoft.com"}</code>{" → Overview → Tenant ID (a GUID)."}</p>
        <h4>{"Configure via GPO (applies to domain-joined AVD hosts)"}</h4>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Get the OneDrive ADMX files. "}<strong>{"Recommended:"}</strong>{" download the standalone bundle from "}<code>{"https://aka.ms/OneDriveADMX"}</code>{" — works regardless of which OneDrive install variant you're running."}<br /><br />{" "}<strong>{"Alternative — locate the bundled files:"}</strong>{" OneDrive installs "}<strong>{"per-user by default"}</strong>{", so the ADMX lives in your profile at "}<code>{"%LOCALAPPDATA%\\Microsoft\\OneDrive\\[version]\\adm\\"}</code>{" (not Program Files). Per-machine installs (rare, opt-in via "}<code>{"OneDriveSetup.exe /allusers"}</code>{") put them at "}<code>{"C:\\Program Files\\Microsoft OneDrive\\[version]\\adm\\"}</code>{". Find the exact path with PowerShell:"}<br /><br />{" "}<code>{"Get-ChildItem -Path \"$env:LOCALAPPDATA\\Microsoft\\OneDrive\" -Recurse -Filter \"OneDrive.admx\" | Select FullName"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"From DC01, copy "}<code>{"OneDrive.admx"}</code>{" to the Central Store: "}<code>{"\\\\corp.contoso.local\\SYSVOL\\corp.contoso.local\\Policies\\PolicyDefinitions\\"}</code>{". This makes the policy template available to every GPO editor in the domain"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Copy "}<code>{"OneDrive.adml"}</code>{" to the language subfolder: "}<code>{"\\\\corp.contoso.local\\SYSVOL\\corp.contoso.local\\Policies\\PolicyDefinitions\\en-US\\"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t"><strong>{"Create a new GPO for OneDrive settings."}</strong>{" This is a fresh GPO you build now — not the Entra group from Step 1.4. In GPMC: right-click "}<strong>{"Group Policy Objects"}</strong>{" → "}<strong>{"New"}</strong>{" → name it "}<code>{"AVD-OneDrive-KFM-v1"}</code>{" following the naming convention from Step 3.1"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t"><strong>{"Link the GPO to the AVD computers OU."}</strong>{" Right-click "}<code>{"OU=HostPool-Prod,OU=AVD,OU=Contoso"}</code>{" → "}<strong>{"Link an Existing GPO"}</strong>{" → select "}<code>{"AVD-OneDrive-KFM-v1"}</code>{". The GPO only applies to computer accounts inside this OU"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t"><strong>{"Edit the GPO."}</strong>{" Right-click "}<code>{"AVD-OneDrive-KFM-v1"}</code>{" → "}<strong>{"Edit"}</strong>{". The Group Policy Management Editor opens. Navigate to "}<strong>{"Computer Configuration → Policies → Administrative Templates → OneDrive"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"7"}</div>
            <div className="step-t">{"Enable "}<strong>{"\"Silently sign in users to the OneDrive sync app with their Windows credentials\""}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"8"}</div>
            <div className="step-t">{"Enable "}<strong>{"\"Silently move Windows known folders to OneDrive\""}</strong>{" — enter your Tenant ID and set \"Show notification\" to off"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"9"}</div>
            <div className="step-t">{"Enable "}<strong>{"\"Use OneDrive Files On-Demand\""}</strong>{" (critical — keeps profile small)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"10"}</div>
            <div className="step-t">{"Enable "}<strong>{"\"Prevent users from redirecting their Windows known folders to their PC\""}</strong>{" (blocks them from undoing KFM)"}</div>
          </div>
        </div>
        <div className="ib note"><b>{"GPOs vs Entra Groups — Don't Confuse Them"}</b>{"The "}<code>{"GRP-AD-AVD-Users"}</code>{" and other groups from Step 1.4 are "}<em>{"security groups"}</em>{" — they identify "}<em>{"who"}</em>{" gets access. The GPO you create here is a "}<em>{"Group Policy Object"}</em>{" — it defines "}<em>{"what configuration"}</em>{" applies to computers in an OU. The GPO doesn't reference the Entra security groups; it applies to whatever computer accounts live in the OU it's linked to (in this case, the AVD session host accounts)."}</div>
        <div className="ib tip"><b>{"Files On-Demand is Non-Negotiable for AVD"}</b>{"Without it, every user's entire OneDrive downloads into their FSLogix profile VHDX, ballooning sizes to 100+ GB and breaking the session host's storage."}</div>
        <div className="ib note"><b>{"Central Store Prerequisite"}</b>{"The Central Store path ("}<code>{"\\\\corp.contoso.local\\SYSVOL\\corp.contoso.local\\Policies\\PolicyDefinitions"}</code>{") may not exist yet on a fresh DC. If GPMC doesn't show \"Policy definitions (ADMX files) retrieved from the central store,\" create the folder structure manually on DC01 by copying "}<code>{"C:\\Windows\\PolicyDefinitions\\"}</code>{" to the SYSVOL path. Once present, all DCs replicate it and all GPO editors automatically use it."}</div>
      </div>
      <div className="phase" id="p3">
        <div className="phase-num">{"03"}</div>
        <h2>{"Group Policy — On-Prem Side"}</h2>
        <p>{"GPOs handle the AVD session hosts (domain-joined) and any legacy workstations. Intune handles cloud-managed devices."}</p>
      </div>
      <div className="sec" id="s31">
        <h3>{"Step 3.1 — GPO Naming & Linking Strategy"}</h3>
        <p>{"Bad GPO design is one of the most common failure modes for cloud engineers and sysadmins. Use this discipline:"}</p>
        <ul>
          <li><strong>{"One GPO, one purpose."}</strong>{" Don't lump 40 settings into \"Workstation Settings\""}</li>
          <li><strong>{"Name by scope-purpose-version."}</strong>{" Example: "}<code>{"AVD-FSLogix-Config-v3"}</code></li>
          <li><strong>{"Link at the right level."}</strong>{" AVD-specific GPOs link to "}<code>{"OU=AVD"}</code>{", never higher"}</li>
          <li><strong>{"Document in the description field."}</strong>{" Future-you will thank you"}</li>
        </ul>
      </div>
      <div className="sec" id="s32">
        <h3>{"Step 3.2 — Configure FS01 as the FSLogix File Server"}</h3>
        <p>{"Before creating the FSLogix GPO in the next step, the file share it points to must exist. This step prepares "}<code>{"FS01"}</code>{" as the SMB host for FSLogix profile containers. Skipping this means GPO 1 in Step 3.3 will reference a path that doesn't exist, and AVD users will fall back to local profiles (or fail to log in entirely once GPO 1 takes effect)."}</p>
        <div className="ib note"><b>{"Path A vs Path B"}</b>{"This step assumes "}<strong>{"Path A (Hybrid Hyper-V)"}</strong>{" with "}<code>{"FS01"}</code>{" as a domain-joined Windows file server. For "}<strong>{"Path B (All-Azure)"}</strong>{", the recommended modern alternative is "}<strong>{"Azure Files (Premium tier)"}</strong>{" joined to your domain or Entra Domain Services — Microsoft's documented best practice for AVD profile storage. The permission model is similar; the share creation differs. Adapt accordingly."}</div>
        <h4>{"Add and Format the Data Disk on FS01"}</h4>
        <p>{"From Phase 1, FS01 was provisioned with an 80 GB OS disk and a 200 GB data disk. The data disk usually arrives uninitialized. On FS01:"}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"PowerShell — Initialize and format the data disk"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# Find the uninitialized disk"}</span>{"\n"}<span className="km">{"Get-Disk"}</span>{" | "}<span className="km">{"Where-Object"}</span>{" "}<span className="kv">{"{"}</span>{" "}<span className="kv">{"$_"}</span>{".PartitionStyle "}<span className="kk">{"-eq"}</span>{" "}<span className="ks">{"'RAW'"}</span>{" "}<span className="kv">{"}"}</span>{"\n\n"}<span className="kc">{"# Initialize, partition, and format it (assumes disk number 1)"}</span>{"\n"}<span className="km">{"Initialize-Disk"}</span>{" "}<span className="kk">{"-Number"}</span>{" 1 "}<span className="kk">{"-PartitionStyle"}</span>{" GPT\n"}<span className="km">{"New-Partition"}</span>{" "}<span className="kk">{"-DiskNumber"}</span>{" 1 "}<span className="kk">{"-UseMaximumSize"}</span>{" "}<span className="kk">{"-DriveLetter"}</span>{" D\n"}<span className="km">{"Format-Volume"}</span>{" "}<span className="kk">{"-DriveLetter"}</span>{" D "}<span className="kk">{"-FileSystem"}</span>{" NTFS "}<span className="kk">{"-NewFileSystemLabel"}</span>{" "}<span className="ks">{"\"FSLogix\""}</span>{" "}<span className="kk">{"-AllocationUnitSize"}</span>{" 65536 "}<span className="kk">{"-Confirm:$false"}</span>{"\n\n"}<span className="kc">{"# Create the folder structure"}</span>{"\n"}<span className="km">{"New-Item"}</span>{" "}<span className="kk">{"-Path"}</span>{" "}<span className="ks">{"\"D:\\FSLogix\""}</span>{" "}<span className="kk">{"-ItemType"}</span>{" Directory"}</code></pre>
        </div>
        <div className="ib tip"><b>{"Why a 64 KB Allocation Unit Size"}</b>{"FSLogix VHDX files are large (multi-GB) and benefit from a larger NTFS allocation unit. Microsoft recommends "}<code>{"64K"}</code>{" (the maximum) for FSLogix profile storage — it reduces file fragmentation and improves I/O performance for the workload pattern of mounting/unmounting VHDX files."}</div>
        <h4>{"Create the SMB Share"}</h4>
        <p>{"Create the share with the "}<code>{"$"}</code>{" suffix to hide it from network browsing (a security/hygiene convention):"}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"PowerShell — Create the hidden SMB share"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="km">{"New-SmbShare"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"\"fslogix$\""}</span>{" `\n             "}<span className="kk">{"-Path"}</span>{" "}<span className="ks">{"\"D:\\FSLogix\""}</span>{" `\n             "}<span className="kk">{"-FullAccess"}</span>{" "}<span className="ks">{"\"Domain Admins\""}</span>{" `\n             "}<span className="kk">{"-ChangeAccess"}</span>{" "}<span className="ks">{"\"Authenticated Users\""}</span>{" `\n             "}<span className="kk">{"-EncryptData"}</span>{" "}<span className="kv">{"$true"}</span>{" `\n             "}<span className="kk">{"-FolderEnumerationMode"}</span>{" AccessBased"}</code></pre>
        </div>
        <p>{"Notes on the parameters:"}</p>
        <ul>
          <li><strong><code>{"-EncryptData $true"}</code></strong>{" — Enables SMB 3 encryption in transit. Strongly recommended for profile data, which includes credentials and sensitive user data"}</li>
          <li><strong><code>{"-FolderEnumerationMode AccessBased"}</code></strong>{" — Access-Based Enumeration: users only see folders they have access to. Combined with the NTFS permissions below, this means users only see their own profile folder in directory listings"}</li>
          <li><strong><code>{"-ChangeAccess \"Authenticated Users\""}</code></strong>{" — Share-level permission only. The real restrictions are enforced by NTFS below"}</li>
        </ul>
        <h4>{"Configure NTFS Permissions"}</h4>
        <p>{"FSLogix has a specific permission pattern that lets each user create and own their profile folder while preventing access to other users' folders. From an elevated PowerShell on FS01:"}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"PowerShell — Set FSLogix-recommended NTFS permissions"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kv">{"$path"}</span>{" = "}<span className="ks">{"\"D:\\FSLogix\""}</span>{"\n\n"}<span className="kc">{"# Remove inherited permissions and start clean"}</span>{"\nicacls "}<span className="kv">{"$path"}</span>{" /inheritance:r\n\n"}<span className="kc">{"# Administrators - Full Control (this folder, subfolders, files)"}</span>{"\nicacls "}<span className="kv">{"$path"}</span>{" /grant "}<span className="ks">{"\"BUILTIN\\Administrators:(OI)(CI)F\""}</span>{"\n\n"}<span className="kc">{"# SYSTEM - Full Control (this folder, subfolders, files)"}</span>{"\nicacls "}<span className="kv">{"$path"}</span>{" /grant "}<span className="ks">{"\"NT AUTHORITY\\SYSTEM:(OI)(CI)F\""}</span>{"\n\n"}<span className="kc">{"# CREATOR OWNER - Modify (subfolders and files only — applies after a user creates their folder)"}</span>{"\nicacls "}<span className="kv">{"$path"}</span>{" /grant "}<span className="ks">{"\"CREATOR OWNER:(OI)(CI)(IO)M\""}</span>{"\n\n"}<span className="kc">{"# Authenticated Users - Modify, this folder only (lets users create their own subfolder)"}</span>{"\nicacls "}<span className="kv">{"$path"}</span>{" /grant "}<span className="ks">{"\"NT AUTHORITY\\Authenticated Users:(NP)M\""}</span>{"\n\n"}<span className="kc">{"# Verify"}</span>{"\nicacls "}<span className="kv">{"$path"}</span></code></pre>
        </div>
        <p>{"The flag meanings in "}<code>{"icacls"}</code>{":"}</p>
        <ul>
          <li><strong>{"OI"}</strong>{" = Object Inherit (applies to files)"}</li>
          <li><strong>{"CI"}</strong>{" = Container Inherit (applies to subfolders)"}</li>
          <li><strong>{"IO"}</strong>{" = Inherit Only (doesn't apply to this folder, only inherited objects)"}</li>
          <li><strong>{"NP"}</strong>{" = No Propagate (this folder only — children don't inherit)"}</li>
          <li><strong>{"F"}</strong>{" = Full Control, "}<strong>{"M"}</strong>{" = Modify"}</li>
        </ul>
        <div className="ib warn"><b>{"Why This Specific Permission Set Works"}</b>{"The trick is in "}<strong>{"CREATOR OWNER + Authenticated Users (NP)"}</strong>{":"}<br /><br />{" • Any authenticated user can create their own folder at the share root (Modify, This Folder Only)"}<br />{" • Once they create it, they automatically become its owner — and CREATOR OWNER's permissions kick in (Modify on subfolders and files)"}<br />{" • Other users can't see or access folders they didn't create, because their Modify permission stops at the share root"}<br /><br />{" This is the security model Microsoft documents for FSLogix. Don't substitute Domain Users with Full Control on the whole share — that defeats the isolation between user profiles."}</div>
        <h4>{"Verify the Share is Accessible"}</h4>
        <p>{"From another domain-joined machine (e.g., MGMT01), test the share works:"}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"PowerShell — Test from MGMT01"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# Should succeed (you're a Domain Admin)"}</span>{"\n"}<span className="km">{"Test-Path"}</span>{" "}<span className="ks">{"\"\\\\FS01\\fslogix$\""}</span>{"\n\n"}<span className="kc">{"# Sign in as a test user and verify they can create a folder but not access another user's"}</span>{"\n"}<span className="km">{"Get-SmbShare"}</span>{" "}<span className="kk">{"-CimSession"}</span>{" FS01 "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"\"fslogix$\""}</span>{" | "}<span className="km">{"Format-List"}</span></code></pre>
        </div>
        <div className="ib danger"><b>{"April 2026 Kerberos Hardening — Important"}</b>{"Microsoft changed the default Kerberos encryption type from RC4 to AES-SHA1 in the April 2026 Windows Server update. SMB shares hosting FSLogix containers must support AES-SHA1 or AES-SHA2 — RC4-only shares may have access issues after the update. Modern Windows Server (2019, 2022, 2025) and a recent domain functional level support AES by default, so a standard Server 2022 install with the latest updates should work without changes. If you're running an older OS or have explicitly forced RC4 in Group Policy, verify Kerberos encryption settings before relying on the share in production."}</div>
      </div>
      <div className="sec" id="s33">
        <h3>{"Step 3.3 — Create the AVD Core GPOs"}</h3>
        <p>{"This step creates four GPOs that together configure the AVD session hosts. Before any of them work, you need the right Administrative Templates in the Central Store and a clear understanding of which type of GPO setting you're using."}</p>
        <h4>{"Prerequisites — ADMX Templates Required"}</h4>
        <p>{"Two of these GPOs depend on Administrative Templates that "}<strong>{"aren't built into Windows"}</strong>{". They must be downloaded and added to the Central Store before the relevant settings will appear in GPMC:"}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"GPO"}</th>
                <th>{"Required ADMX Bundle"}</th>
                <th>{"Download"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"AVD-FSLogix-Profile-v1"}</td>
                <td>{"FSLogix Administrative Templates"}</td>
                <td><code>{"aka.ms/fslogix_download"}</code>{" → extract "}<code>{"fslogix.admx"}</code>{" and "}<code>{"fslogix.adml"}</code></td>
              </tr>
              <tr>
                <td>{"AVD-Outlook-Cached-v1"}</td>
                <td>{"Microsoft 365 Apps Administrative Templates"}</td>
                <td><code>{"microsoft.com/download/details.aspx?id=49030"}</code>{" (search \"Office Administrative Template files\")"}</td>
              </tr>
              <tr>
                <td>{"AVD-OneDrive-KFM-v1"}</td>
                <td>{"OneDrive Administrative Template"}</td>
                <td><code>{"aka.ms/OneDriveADMX"}</code>{" (already covered in Step 2.3)"}</td>
              </tr>
              <tr>
                <td>{"AVD-Office-SCA-v1"}</td>
                <td>{"None — uses Group Policy Preferences (built-in)"}</td>
                <td>{"n/a"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>{"For each ADMX bundle, copy the "}<code>{".admx"}</code>{" file to "}<code>{"\\\\corp.contoso.local\\SYSVOL\\corp.contoso.local\\Policies\\PolicyDefinitions\\"}</code>{" and the matching "}<code>{".adml"}</code>{" to the "}<code>{"en-US\\"}</code>{" subfolder. Refer to Section 12 of the Group Policy Field Guide if you need the full procedure or hit issues."}</p>
        <div className="ib danger"><b>{"Seed the Central Store with Baseline Windows ADMX First"}</b>{"When the Central Store exists, GPMC uses "}<strong>{"only"}</strong>{" what's in it — it does not fall back to the local machine's "}<code>{"C:\\Windows\\PolicyDefinitions\\"}</code>{" for missing settings. If you copy only third-party ADMX files (FSLogix, Office, OneDrive) without first seeding the baseline Windows templates, you'll lose access to core Windows policy nodes — "}<strong>{"System"}</strong>{" (which contains loopback processing — needed for GPO 4 below), "}<strong>{"Windows Components"}</strong>{", "}<strong>{"Control Panel"}</strong>{", "}<strong>{"Network"}</strong>{", and others."}<br /><br />{" "}<strong>{"One-time setup on DC01 (run as Domain Admin):"}</strong><br />{" "}<code>{"$domain = (Get-ADDomain).DNSRoot"}</code><br />{" "}<code>{"Copy-Item \"C:\\Windows\\PolicyDefinitions\\*\" \"C:\\Windows\\SYSVOL\\sysvol\\$domain\\Policies\\PolicyDefinitions\\\" -Recurse -Force"}</code><br /><br />{" This copies the hundreds of baseline ADMX/ADML files into the Central Store. Do this "}<strong>{"before"}</strong>{" adding third-party bundles, or run it now if your Central Store is already populated with only third-party templates — the copy is non-destructive to existing files."}</div>
        <div className="ib tip"><b>{"The Two-Location Pattern for Self-Extracting Bundles"}</b>{"The Office Administrative Templates download is a "}<strong>{"self-extracting archive"}</strong>{", not an installer. When you run it, the \"Browse For Folder\" dialog asks where to extract the files — this is a "}<strong>{"temporary staging location"}</strong>{", not the final destination."}<br /><br />{" "}<strong>{"Extract to:"}</strong>{" any folder where you have write access — "}<code>{"C:\\Temp\\OfficeADMX"}</code>{" works well (use the "}<strong>{"Make New Folder"}</strong>{" button in the dialog if it doesn't exist). The files don't "}<em>{"run"}</em>{" from this location; they just sit there waiting to be copied."}<br /><br />{" "}<strong>{"Copy from staging into the Central Store:"}</strong><br />{" • All "}<code>{".admx"}</code>{" files (from the "}<code>{"admx\\"}</code>{" subfolder of the extraction) → "}<code>{"\\\\corp.contoso.local\\SYSVOL\\corp.contoso.local\\Policies\\PolicyDefinitions\\"}</code><br />{" • All "}<code>{".adml"}</code>{" files (from "}<code>{"admx\\en-us\\"}</code>{") → "}<code>{"\\\\corp.contoso.local\\SYSVOL\\corp.contoso.local\\Policies\\PolicyDefinitions\\en-US\\"}</code><br /><br />{" After copying, the staging folder can be deleted — the Central Store is the only location that matters going forward. The same pattern applies to most third-party ADMX bundles (FSLogix, Adobe, Chrome, etc.)."}</div>
        <div className="ib note"><b>{"Policies vs Preferences — Know Which You're Using"}</b>{"Two of these GPOs use "}<strong>{"Administrative Templates"}</strong>{" (true policies that write to "}<code>{"HKLM\\Software\\Policies\\"}</code>{" and auto-revert when the GPO no longer applies). One uses "}<strong>{"Group Policy Preferences"}</strong>{" (one-time configuration that persists in the regular registry even after the GPO is removed). Knowing which mechanism you're using matters for troubleshooting and rollback."}</div>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />
        <h4>{"GPO 1: AVD-FSLogix-Profile-v1"}</h4>
        <p>{"FSLogix Profile Container redirects each user's profile (AppData, registry hive, Documents) into a VHDX file on a file share, so the profile follows users between session hosts."}</p>
        <h5>{"Create and Link"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"In GPMC, right-click "}<strong>{"Group Policy Objects"}</strong>{" → "}<strong>{"New"}</strong>{" → name it "}<code>{"AVD-FSLogix-Profile-v1"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Right-click the "}<code>{"OU=HostPool-Prod,OU=AVD,OU=Contoso"}</code>{" OU → "}<strong>{"Link an Existing GPO"}</strong>{" → select "}<code>{"AVD-FSLogix-Profile-v1"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Right-click the GPO → "}<strong>{"Edit"}</strong>{" to open the Group Policy Management Editor"}</div>
          </div>
        </div>
        <h5>{"Configure Settings"}</h5>
        <p>{"FSLogix policies are organized into subfolders under "}<strong>{"Computer Configuration → Policies → Administrative Templates → FSLogix → Profile Containers"}</strong>{". Settings live at two different levels — the root and the "}<strong>{"Container and Directory Naming"}</strong>{" subfolder. The exact tree structure varies slightly by FSLogix version (FSLogix 2210 hotfix 2 simplified the layout), so if a setting isn't at the path shown, check sibling subfolders."}</p>
        <div className="ib warn"><b>{"FSLogix Has a Quirky Two-Level Configuration (Older Templates)"}</b>{"For each FSLogix setting in pre-2210h2 templates, two things must be configured:"}<br />{" • "}<strong>{"The radio button at the top"}</strong>{" (Not Configured / Enabled / Disabled) — controls whether the policy is "}<em>{"applied at all"}</em><br />{" • "}<strong>{"The Options dropdown"}</strong>{" below — the actual value the setting takes"}<br /><br />{" For boolean policies like \"Delete Local Profile When VHD Should Apply\", you set "}<strong>{"both"}</strong>{" to Enabled. Setting only the top radio to Enabled without touching the dropdown produces unpredictable behavior — and as the policy's help text warns: "}<em>{"\"Once this policy is Enabled or Disabled, setting it back to Not Configured has NO EFFECT.\""}</em>{" Be deliberate."}<br /><br />{" "}<strong>{"In FSLogix 2210 hotfix 2 and newer,"}</strong>{" the redundant dropdown was removed for boolean policies — you only set the top radio. Check your policy dialog: if there's no Options dropdown beneath the radio, you're on the newer template and just set the top radio."}</div>
        <h6 style={{ fontWeight: "700", color: "var(--ink-mid)", fontSize: ".92rem", margin: "1.2rem 0 .4rem" }}>{"Settings at: Profile Containers (root)"}</h6>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Setting"}</th>
                <th>{"Radio (top)"}</th>
                <th>{"Options dropdown / Value"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"Enabled"}</td>
                <td>{"Enabled"}</td>
                <td>{"Options: "}<code>{"Enabled"}</code>{" (turns FSLogix on)"}</td>
              </tr>
              <tr>
                <td>{"VHD Locations"}</td>
                <td>{"Enabled"}</td>
                <td>{"VHD Locations field: "}<code>{"\\\\FS01\\fslogix$"}</code>{" (Path A) or "}<code>{"\\\\fileserver01\\fslogix$"}</code>{" (Path B)"}</td>
              </tr>
              <tr>
                <td>{"Size in MBs"}</td>
                <td>{"Enabled"}</td>
                <td>{"Value: "}<code>{"30000"}</code>{" (30 GB per user)"}</td>
              </tr>
              <tr>
                <td>{"Delete Local Profile When VHD Should Apply"}</td>
                <td>{"Enabled"}</td>
                <td>{"Options: "}<code>{"Enabled"}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <h6 style={{ fontWeight: "700", color: "var(--ink-mid)", fontSize: ".92rem", margin: "1.2rem 0 .4rem" }}>{"Settings at: Profile Containers → Container and Directory Naming"}</h6>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Setting"}</th>
                <th>{"Radio (top)"}</th>
                <th>{"Options dropdown / Value"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"Volume Type (VHD or VHDX)"}</td>
                <td>{"Enabled"}</td>
                <td>{"Options: "}<code>{"VHDX"}</code></td>
              </tr>
              <tr>
                <td>{"Flip Flop Profile Directory Name"}</td>
                <td>{"Enabled"}</td>
                <td>{"Options: "}<code>{"Enabled"}</code>{" (produces "}<code>{"USERNAME_SID"}</code>{" folder format, easier troubleshooting)"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>{"All settings are "}<strong>{"Computer Configuration"}</strong>{" — they apply at session host boot, not at user login."}</p>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />
        <h4>{"GPO 2: AVD-Office-SCA-v1"}</h4>
        <p>{"Shared Computer Activation (SCA) lets Microsoft 365 Apps activate per-user on a shared session host without consuming a per-device license. The settings are registry values that don't have native Administrative Template entries, so we use "}<strong>{"Group Policy Preferences"}</strong>{" instead."}</p>
        <h5>{"Create and Link"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Create the GPO "}<code>{"AVD-Office-SCA-v1"}</code>{" and link it to "}<code>{"OU=HostPool-Prod,OU=AVD,OU=Contoso"}</code>{" using the same process as GPO 1"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Edit the GPO"}</div>
          </div>
        </div>
        <h5>{"Configure Settings"}</h5>
        <p>{"Navigate to: "}<strong>{"Computer Configuration → Preferences → Windows Settings → Registry"}</strong></p>
        <p>{"For each value below: right-click "}<strong>{"Registry"}</strong>{" → "}<strong>{"New → Registry Item"}</strong>{". Fill out the dialog:"}</p>
        <div className="ib warn"><b>{"Type the Key Path — Don't Try to Browse"}</b>{"The \"...\" browse button next to "}<strong>{"Key Path"}</strong>{" opens the local machine's registry (in this case, your DC's). Since Office isn't installed on a DC, "}<code>{"SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration"}</code>{" won't exist there to browse to. "}<strong>{"Type the path manually"}</strong>{" — GP Preferences ships the instruction to wherever the GPO applies (the AVD session hosts), and the Action \"Update\" creates the key on the target if it doesn't exist. Format: no leading backslash, no "}<code>{"HKLM:"}</code>{" prefix — just the path under the hive root."}</div>
        <div className="ib note"><b>{"Leave the \"Default\" Checkbox Unchecked"}</b>{"Next to the "}<strong>{"Value Name"}</strong>{" field you'll see a checkbox labeled "}<strong>{"Default"}</strong>{". That checkbox tells the GPO to write to the key's "}<em>{"unnamed default value"}</em>{" (the one shown as "}<code>{"(Default)"}</code>{" in "}<code>{"regedit"}</code>{") rather than a named value. "}<strong>{"Leave it unchecked"}</strong>{" — SCA requires named registry values ("}<code>{"SharedComputerLicensing"}</code>{", "}<code>{"SCLCacheOverride"}</code>{", etc.), not the anonymous default slot. Type the value name into the field instead."}</div>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Field"}</th>
                <th>{"Value (1)"}</th>
                <th>{"Value (2)"}</th>
                <th>{"Value (3)"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{"Action"}</strong></td>
                <td>{"Update"}</td>
                <td>{"Update"}</td>
                <td>{"Update"}</td>
              </tr>
              <tr>
                <td><strong>{"Hive"}</strong></td>
                <td>{"HKEY_LOCAL_MACHINE"}</td>
                <td>{"HKEY_LOCAL_MACHINE"}</td>
                <td>{"HKEY_LOCAL_MACHINE"}</td>
              </tr>
              <tr>
                <td><strong>{"Key Path"}</strong></td>
                <td><code>{"SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration"}</code></td>
                <td>{"(same)"}</td>
                <td>{"(same)"}</td>
              </tr>
              <tr>
                <td><strong>{"Value Name"}</strong></td>
                <td>{"SharedComputerLicensing"}</td>
                <td>{"SCLCacheOverride"}</td>
                <td>{"SCLCacheOverrideDirectory"}</td>
              </tr>
              <tr>
                <td><strong>{"Value Type"}</strong></td>
                <td>{"REG_SZ"}</td>
                <td>{"REG_SZ"}</td>
                <td>{"REG_SZ"}</td>
              </tr>
              <tr>
                <td><strong>{"Value Data"}</strong></td>
                <td><code>{"1"}</code></td>
                <td><code>{"1"}</code></td>
                <td><code>{"%LOCALAPPDATA%\\Microsoft\\Office\\Licenses"}</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ib warn"><b>{"Preferences Persist Even After GPO Removal"}</b>{"Because these are Preferences (not true policies), the registry values stay on the machine even if you unlink the GPO. To remove them, you'd need to set the Action to \"Delete\" and let the policy reapply, or remove them via script. This is the trade-off for using Preferences — they reach settings Administrative Templates can't, but require manual cleanup."}</div>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />
        <h4>{"GPO 3: AVD-OneDrive-KFM-v1"}</h4>
        <p>{"Already created in "}<strong>{"Step 2.3"}</strong>{" with the OneDrive Known Folder Move settings. It's already linked to "}<code>{"OU=HostPool-Prod,OU=AVD,OU=Contoso"}</code>{". No additional action needed here — just confirm it's present in GPMC under the AVD OU."}</p>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />
        <h4>{"GPO 4: AVD-Outlook-Cached-v1"}</h4>
        <p>{"Outlook cached mode is essential for AVD performance, but uncapped caching produces enormous OST files that bloat FSLogix profiles. Cap the sync window to manage profile size."}</p>
        <h5>{"Create and Link"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Create the GPO "}<code>{"AVD-Outlook-Cached-v1"}</code>{" and link it to "}<code>{"OU=HostPool-Prod,OU=AVD,OU=Contoso"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Edit the GPO"}</div>
          </div>
        </div>
        <h5>{"Configure Settings"}</h5>
        <p>{"Navigate to: "}<strong>{"User Configuration → Policies → Administrative Templates → Microsoft Outlook 2016 → Account Settings → Exchange → Cached Exchange Mode"}</strong></p>
        <p><em>{"Note:"}</em>{" The node is labeled \"Outlook 2016\" but it applies to all newer versions including the M365 click-to-run Outlook used in AVD."}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Setting"}</th>
                <th>{"State"}</th>
                <th>{"Value"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"Use Cached Exchange Mode for new and existing Outlook profiles"}</td>
                <td>{"Enabled"}</td>
                <td>{"(no value — toggle only)"}</td>
              </tr>
              <tr>
                <td>{"Cached Exchange Mode Sync Settings"}</td>
                <td>{"Enabled"}</td>
                <td><strong>{"3 months"}</strong>{" (from the dropdown — options range from 3 days to All)"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>{"These are "}<strong>{"User Configuration"}</strong>{" settings — they apply at user login, not at machine boot. This means the GPO needs to be linked where the "}<em>{"users"}</em>{" are, OR loopback processing needs to be enabled on the AVD host so the host's user policies apply to whoever logs in."}</p>
        <div className="ib warn"><b>{"The Loopback Requirement"}</b>{"Because this is User Configuration linked to a Computer OU (the AVD hosts), it won't apply by default. You need "}<strong>{"Loopback Processing"}</strong>{" in Merge mode enabled on the AVD hosts for the user settings in this GPO to take effect. Add it to a separate GPO (e.g., "}<code>{"AVD-System-Loopback-v1"}</code>{") linked to the same AVD OU, with: "}<strong>{"Computer Configuration → Policies → Administrative Templates → System → Group Policy → Configure user Group Policy loopback processing mode = Enabled, Merge"}</strong>{"."}</div>
        <div className="ib note"><b>{"Why 3 Months?"}</b>{"FSLogix profile containers hold the entire OST file. A user with 5 years of email and a 50 MB attachment per day produces a 90 GB OST. 3 months keeps it under 5 GB for most users."}</div>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />
        <h4>{"Verify the GPOs Are Configured Correctly"}</h4>
        <p>{"At this point in the build, you've created and linked four GPOs but the "}<strong>{"AVD session hosts don't exist yet"}</strong>{" — they're built in Phase 5. That means you can't yet verify the GPOs by signing in as a test user. What you can verify is that the GPOs are "}<strong>{"linked to the correct OU"}</strong>{" and that their settings are "}<strong>{"configured as expected"}</strong>{". Full end-to-end verification happens in Phase 5 after session hosts exist."}</p>
        <h5>{"Interim Verification (Phase 3) — Confirm Linking and Settings"}</h5>
        <p>{"From DC01, confirm all four GPOs are linked to the AVD OU:"}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"PowerShell — Verify GPO linking"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# List every GPO that applies to the AVD OU (linked here + inherited)"}</span>{"\n"}<span className="km">{"Get-GPInheritance"}</span>{" "}<span className="kk">{"-Target"}</span>{" "}<span className="ks">{"\"OU=HostPool-Prod,OU=AVD,OU=Contoso,DC=corp,DC=contoso,DC=local\""}</span>{" |\n    "}<span className="km">{"Select-Object"}</span>{" "}<span className="kk">{"-ExpandProperty"}</span>{" GpoLinks |\n    "}<span className="km">{"Format-Table"}</span>{" DisplayName, Enabled, Enforced, Order"}</code></pre>
        </div>
        <p>{"You should see all four AVD GPOs in the output with "}<code>{"Enabled = True"}</code>{". If a GPO is missing, it was created but never linked — go back to the relevant Create and Link step above."}</p>
        <p>{"Then in GPMC, click each GPO → "}<strong>{"Settings"}</strong>{" tab → confirm the settings render as configured (e.g., FSLogix VHD Locations shows your file share path, the SCA registry items show the three values, etc.). If the Settings tab is empty, the GPO was created but never edited."}</p>
        <div className="ib warn"><b>{"Why gpresult Won't Show These GPOs Yet"}</b>{"If you run "}<code>{"gpresult /h"}</code>{" on DC01 (or any machine that's not in the AVD OU), the AVD GPOs "}<strong>{"won't appear in the \"Applied GPOs\" section"}</strong>{" — this is expected, not a bug. GPOs only apply to computer accounts that live in the linked OU. DC01 lives in the "}<code>{"Domain Controllers"}</code>{" OU, so it gets the Default Domain Controllers Policy and Default Domain Policy, but not the AVD GPOs."}<br /><br />{" "}<strong>{"For a meaningful gpresult, you need a machine in the AVD OU."}</strong>{" That doesn't exist yet at this phase — session hosts get built in Phase 5. If you want to spot-check before then, you can temporarily move a test Windows VM into the AVD OU (right-click its computer account in ADUC → Move), reboot it, run "}<code>{"gpupdate /force"}</code>{" and "}<code>{"gpresult /h"}</code>{", then move it back when done."}</div>
        <h5>{"Full Verification (Deferred to Phase 5)"}</h5>
        <p>{"After session hosts are deployed in Phase 5, return here and validate end-to-end:"}</p>
        <ul>
          <li>{"On a session host: "}<code>{"gpupdate /force"}</code>{" followed by "}<code>{"gpresult /h C:\\Temp\\gpresult.html"}</code></li>
          <li>{"Open the HTML report — all four AVD GPOs should appear under "}<strong>{"Applied GPOs"}</strong>{" with no errors"}</li>
          <li>{"Reboot the host and sign in as a test user — verify the FSLogix profile mounts, OneDrive signs in silently, SCA cache writes to the user's profile, and Outlook caches with the 3-month limit"}</li>
        </ul>
      </div>
      <div className="phase" id="p4">
        <div className="phase-num">{"04"}</div>
        <h2>{"Intune & Cloud Endpoint Management"}</h2>
        <p>{"Intune handles cloud-joined devices (BYOD, laptops away from the corporate network) and is what we'll use to deploy the activation auto-heal in Phase 6."}</p>
      </div>
      <div className="sec" id="s41">
        <h3>{"Step 4.1 — Configure Microsoft Entra Hybrid Join + Intune Auto-Enrollment"}</h3>
        <p>{"AVD session hosts in this lab follow the "}<strong>{"Microsoft Entra hybrid join"}</strong>{" pattern — domain-joined to on-prem AD (so GPO applies) AND registered with Entra ID (so Intune and Conditional Access apply). This step has two halves: configuring hybrid join on the sync server, and turning on automatic Intune enrollment in the Intune admin center."}</p>
        <div className="ib note"><b>{"\"Microsoft Entra hybrid join\" — formerly Hybrid Azure AD Join"}</b>{"Microsoft rebranded this feature in 2023; both names refer to the same thing. The current Entra Connect Sync wizard uses the new name. If you see the old name in screenshots or older documentation, it's the same setting."}</div>
        <h4>{"Part 1 — Enable Hybrid Join in the Entra Connect Sync Wizard (on ENTRA01)"}</h4>
        <p>{"This is done in the "}<strong>{"Microsoft Entra Connect desktop wizard"}</strong>{" on your sync server ("}<code>{"ENTRA01"}</code>{") — "}<em>{"not"}</em>{" the Microsoft Entra Connect page in the Entra admin center web portal. The web portal is for monitoring; configuration happens in the local wizard."}</p>
        <div className="ib warn"><b>{"You'll Need Two Sets of Credentials"}</b>{"The wizard requires:"}<br />{" • A "}<strong>{"Hybrid Identity Administrator"}</strong>{" account in Entra ID (or Global Administrator)"}<br />{" • An "}<strong>{"Enterprise Admin"}</strong>{" account in on-prem AD — needed to write the Service Connection Point (SCP) to the forest's Configuration partition. This is the registry entry that tells domain-joined machines which Entra tenant to register with"}</div>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"On "}<code>{"ENTRA01"}</code>{", find "}<strong>{"Microsoft Entra Connect"}</strong>{" on the Start menu and launch the desktop wizard (sometimes called "}<code>{"AzureADConnect.exe"}</code>{" — same app)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"On the welcome screen, click "}<strong>{"Configure"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Under "}<strong>{"Additional tasks"}</strong>{", select "}<strong>{"Configure device options"}</strong>{" → click "}<strong>{"Next"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"On the "}<strong>{"Overview"}</strong>{" page, click "}<strong>{"Next"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"On "}<strong>{"Connect to Microsoft Entra ID"}</strong>{", sign in with your Hybrid Identity Administrator (or Global Administrator) account → "}<strong>{"Next"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Under "}<strong>{"Device options"}</strong>{", select "}<strong>{"Configure Microsoft Entra hybrid join"}</strong>{" → "}<strong>{"Next"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"7"}</div>
            <div className="step-t">{"Under "}<strong>{"Device operating systems"}</strong>{", check "}<strong>{"Windows 10 or later domain-joined devices"}</strong>{" (covers Windows 11 multi-session AVD hosts) → "}<strong>{"Next"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"8"}</div>
            <div className="step-t">{"Under "}<strong>{"SCP configuration"}</strong>{", expand your forest, set the Authentication Service to "}<strong>{"Microsoft Entra ID"}</strong>{", click "}<strong>{"Add"}</strong>{", and enter Enterprise Admin credentials when prompted → "}<strong>{"Next"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"9"}</div>
            <div className="step-t">{"Click "}<strong>{"Configure"}</strong>{" on the Ready to configure page → wait for completion → "}<strong>{"Exit"}</strong></div>
          </div>
        </div>
        <div className="ib tip"><b>{"What the SCP Does"}</b>{"The Service Connection Point is a registry entry written to your AD forest's Configuration partition. When a domain-joined machine starts up, it looks for the SCP to find out which Entra tenant to register with. Without the SCP, machines won't know where to register — even if everything else is configured correctly. Setting the SCP requires Enterprise Admin once, then it stays there permanently."}</div>
        <div className="ib note"><b>{"OU Scoping Already Handled"}</b>{"Entra Connect Sync only syncs computer objects from the OUs you selected during Step 1.3 setup. Since your AVD session hosts will live in "}<code>{"OU=HostPool-Prod,OU=AVD,OU=Contoso"}</code>{" and your existing OU filter includes the Contoso OU tree, the AVD computer objects will sync automatically — no additional scoping needed here. If your sync filter excludes the AVD OU, re-run the wizard and adjust the OU filter in "}<strong>{"Configure synchronization filtering"}</strong>{"."}</div>
        <h4>{"Part 2 — Enable Intune Automatic Enrollment"}</h4>
        <p>{"This is done in the Microsoft Intune admin center. Automatic MDM enrollment lets devices that join Entra (hybrid or cloud-joined) automatically enroll into Intune without manual setup on each one."}</p>
        <div className="ib warn"><b>{"P1 Required"}</b>{"Automatic MDM enrollment is a "}<strong>{"premium Entra feature"}</strong>{" requiring "}<strong>{"Entra ID P1 or P2"}</strong>{" for every user who will enroll devices. Without P1, the automatic enrollment settings appear greyed out. Your E5 trial includes P2, so this is covered for the lab — but it's worth knowing for production sizing."}</div>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Sign in to "}<code>{"intune.microsoft.com"}</code>{" as Global Administrator or Intune Administrator"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Navigate to "}<strong>{"Devices → Device onboarding → Enrollment"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Open the "}<strong>{"Windows"}</strong>{" tab → select "}<strong>{"Automatic Enrollment"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Set "}<strong>{"MDM user scope"}</strong>{" to "}<strong>{"All"}</strong>{" (or "}<strong>{"Some"}</strong>{" + select "}<code>{"GRP-AD-AVD-Users"}</code>{" for tighter scoping while you pilot). Important: this targets "}<em>{"users"}</em>{", not devices"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Set "}<strong>{"WIP user scope"}</strong>{" to "}<strong>{"None"}</strong>{". WIP (Windows Information Protection) is Microsoft's deprecated Windows-specific data protection feature — sunset in July 2022 and replaced by Microsoft Purview Information Protection. The setting still appears on this page for legacy reasons but should be set to None for new deployments"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Leave the MDM terms of use URL, MDM discovery URL, and MDM compliance URL at their defaults → click "}<strong>{"Save"}</strong></div>
          </div>
        </div>
        <div className="ib danger"><b>{"The WIP vs MDM Scope Trap"}</b>{"If a user is included in "}<strong>{"both"}</strong>{" the MDM user scope and the WIP user scope, the behavior is unintuitive: "}<strong>{"WIP takes precedence on personal devices and blocks Intune MDM enrollment entirely"}</strong>{". The device shows \"not enrolled\" and users see error code "}<code>{"80180006"}</code>{". Always set WIP user scope to None unless you have a deliberate reason to use it."}</div>
        <div className="ib tip"><b>{"About the MSOnline Deprecation Banner"}</b>{"If you see the orange banner on the Entra Connect page warning about MSOnline deprecation (April 7, 2025), it's about the older PowerShell module being retired. As long as your Entra Connect Sync version is recent (1.6+ or later), you're not affected. If you installed Entra Connect in this lab using the current Microsoft download, you're on a supported version. You can check with "}<code>{"Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Azure AD Connect'"}</code>{" on ENTRA01."}</div>
        <h4>{"Verification (Phase 4)"}</h4>
        <p>{"You can't fully verify hybrid join until session hosts exist in Phase 5 — but you can confirm the SCP was written successfully. Run this on "}<strong>{"DC01"}</strong>{" (it has the ActiveDirectory PowerShell module installed by default — any DC works). If you'd rather run it from a member server like MGMT01, install the module first with "}<code>{"Install-WindowsFeature RSAT-AD-PowerShell"}</code>{":"}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"PowerShell — Confirm SCP exists in AD"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# Check for the Service Connection Point in the Configuration partition"}</span>{"\n"}<span className="km">{"Get-ADObject"}</span>{" "}<span className="kk">{"-Filter"}</span>{" "}<span className="ks">{"\"objectClass -eq 'serviceConnectionPoint'\""}</span>{" `\n             "}<span className="kk">{"-SearchBase"}</span>{" "}<span className="ks">{"\"CN=Services,CN=Configuration,$((Get-ADRootDSE).rootDomainNamingContext)\""}</span>{" `\n             "}<span className="kk">{"-Properties"}</span>{" keywords |\n    "}<span className="km">{"Where-Object"}</span>{" "}<span className="kv">{"{"}</span>{" "}<span className="kv">{"$_"}</span>{".keywords "}<span className="kk">{"-like"}</span>{" "}<span className="ks">{"\"*azureADId*\""}</span>{" "}<span className="kv">{"}"}</span>{" |\n    "}<span className="km">{"Select-Object"}</span>{" Name, keywords"}</code></pre>
        </div>
        <p>{"You should see one or two entries — one for your Entra tenant ID and one for your verified domain. If nothing returns, the SCP wasn't written; rerun the wizard with Enterprise Admin credentials."}</p>
        <div className="ib note"><b>{"Full Verification Comes in Phase 5"}</b>{"After AVD session hosts are deployed: "}<strong>{"Entra ID Joined"}</strong>{" hosts typically enroll in Intune within ~15 minutes; "}<strong>{"Hybrid Entra Joined"}</strong>{" hosts can take 1-3 hours and occasionally fail entirely. Intune enrollment has a 24-hour timeout — if it doesn't succeed within that window, the device stays unmanaged and you'll need to investigate (typically "}<code>{"dsregcmd /status"}</code>{" on the affected host)."}</div>
      </div>
      <div className="sec" id="s42">
        <h3>{"Step 4.2 — Conditional Access for AVD"}</h3>
        <p>{"Conditional Access (CA) policies evaluate every sign-in to Entra-protected resources and decide whether to allow, require additional verification, or block. AVD has its own specific cloud apps that must be targeted for sign-in policies to apply correctly."}</p>
        <h4>{"The Two AVD Cloud Apps"}</h4>
        <p>{"AVD authentication happens in two stages, each with its own Entra \"cloud app\":"}</p>
        <ul>
          <li><strong>{"Azure Virtual Desktop"}</strong>{" — the gateway/broker service. Targeted when a user first opens the AVD client and authenticates to discover available resources"}</li>
          <li><strong>{"Windows Cloud Login"}</strong>{" — used when signing into the actual session host's Windows desktop after launching a session"}</li>
        </ul>
        <p>{"A complete AVD CA policy targets "}<strong>{"both"}</strong>{". Targeting only one leaves a gap."}</p>
        <div className="ib warn"><b>{"Prerequisites Before Starting"}</b>{"To create CA policies you need: "}<strong>{"Conditional Access Administrator"}</strong>{" or "}<strong>{"Global Administrator"}</strong>{" role, "}<strong>{"Entra ID P1 or P2"}</strong>{" for every user the policy targets (your E5 trial includes P2), and the "}<code>{"GRP-CLOUD-CA-Excluded"}</code>{" group with at least one break-glass account in it (created in Step 1.4)."}</div>
        <h4>{"Create the Policy — Step by Step"}</h4>
        <h5>{"Navigate to Conditional Access"}</h5>
        <div className="ib note"><b>{"Portal Navigation Has Changed"}</b>{"Microsoft has reorganized the Entra admin center multiple times. The exact left-navigation path varies depending on portal version and tenant rollout. The "}<strong>{"top search bar"}</strong>{" works reliably regardless of layout — it's the simplest way to reach Conditional Access."}<br /><br />{" "}<strong>{"Don't confuse:"}</strong>{" \"ID Protection → Risk-based Conditional Access\" is a different feature (P2 risk-based policies). You want the standalone "}<strong>{"Conditional Access"}</strong>{" blade."}</div>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Sign in to "}<code>{"entra.microsoft.com"}</code>{" as Conditional Access Administrator or Global Administrator"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"In the search bar at the top of the portal (labeled \"Search resources, services, and docs\"), type "}<code>{"Conditional Access"}</code>{" → in the dropdown under "}<strong>{"Services"}</strong>{", click "}<strong>{"Conditional Access"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"In the Conditional Access sub-navigation on the left, select "}<strong>{"Policies"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Click "}<strong>{"+ Create new policy"}</strong>{" (some portal versions show "}<strong>{"+ New policy"}</strong>{"). Do not use \"+ New policy from template\" — we want a custom one"}</div>
          </div>
        </div>
        <h5>{"Name the Policy"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"In the "}<strong>{"Name"}</strong>{" field at the top of the new policy blade, enter: "}<code>{"AVD-Require-MFA"}</code></div>
          </div>
        </div>
        <h5>{"Configure Assignments → Users"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Under "}<strong>{"Assignments"}</strong>{", click "}<strong>{"Users"}</strong>{" (will say \"0 users and groups selected\")"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"7"}</div>
            <div className="step-t">{"On the "}<strong>{"Include"}</strong>{" tab: select "}<strong>{"Select users and groups"}</strong>{" → check "}<strong>{"Users and groups"}</strong>{" → in the picker, search for and select "}<code>{"GRP-AD-AVD-Users"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"8"}</div>
            <div className="step-t">{"Switch to the "}<strong>{"Exclude"}</strong>{" tab: check "}<strong>{"Users and groups"}</strong>{" → search for and select "}<code>{"GRP-CLOUD-CA-Excluded"}</code>{" (your break-glass group). This is the critical safety net — if MFA infrastructure breaks, accounts in this group can still sign in"}</div>
          </div>
        </div>
        <h5>{"Configure Assignments → Target Resources"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"9"}</div>
            <div className="step-t">{"Under "}<strong>{"Assignments"}</strong>{", click "}<strong>{"Target resources"}</strong>{" (it may show \"No target resources selected\")"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"10"}</div>
            <div className="step-t">{"At the top, ensure "}<strong>{"Select what this policy applies to"}</strong>{" is set to "}<strong>{"Resources (formerly cloud apps)"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"11"}</div>
            <div className="step-t">{"On the "}<strong>{"Include"}</strong>{" tab: select "}<strong>{"Select resources"}</strong>{" → in the search box of the picker, type "}<code>{"Azure Virtual Desktop"}</code>{" → check it"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"12"}</div>
            <div className="step-t">{"In the same picker, search for "}<strong>{"Windows Cloud Login"}</strong>{" → check it. (This is a "}<em>{"separate"}</em>{" app from Azure Virtual Desktop — it handles the second authentication stage when users sign into the session host's Windows desktop.) Click "}<strong>{"Select"}</strong>{" to confirm"}</div>
          </div>
        </div>
        <div className="ib danger"><b>{"\"Windows Cloud Login\" Returns Zero Results?"}</b>{"If searching for "}<strong>{"Windows Cloud Login"}</strong>{" in the Resources picker returns 0 results, the service principal hasn't been provisioned in your tenant yet. Microsoft only auto-creates these service principals once the app has been \"touched\" by an authentication event — and since session hosts don't exist yet at this phase, no one has ever signed into one in your tenant. Provision it manually before continuing:"}<br /><br />{" "}<strong>{"On any machine with internet access, run PowerShell as admin:"}</strong><br />{" "}<code>{"Install-Module Microsoft.Graph -Scope CurrentUser -Force"}</code><br />{" "}<code>{"Connect-MgGraph -Scopes \"Application.ReadWrite.All\""}</code><br />{" "}<code>{"New-MgServicePrincipal -AppId \"270efc09-cd0d-444b-a71f-39af4910ec45\""}</code>{" "}<em>{"(Windows Cloud Login)"}</em><br />{" "}<code>{"New-MgServicePrincipal -AppId \"a4a365df-50f1-4397-bc59-1a1564b8bb9c\""}</code>{" "}<em>{"(Microsoft Remote Desktop — legacy, still referenced in some flows)"}</em><br /><br />{" After running these, refresh the Resources picker and search again — both apps will now appear. The same trick works for any Microsoft cloud app that's missing from the picker."}</div>
        <h5>{"Configure Access Controls → Grant"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"13"}</div>
            <div className="step-t">{"Under "}<strong>{"Access controls"}</strong>{", click "}<strong>{"Grant"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"14"}</div>
            <div className="step-t">{"In the panel, select "}<strong>{"Grant access"}</strong>{" (radio button at the top)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"15"}</div>
            <div className="step-t">{"Check "}<strong>{"Require multifactor authentication"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"16"}</div>
            <div className="step-t">{"At the bottom, leave "}<strong>{"For multiple controls"}</strong>{" at "}<strong>{"Require all the selected controls"}</strong>{" → click "}<strong>{"Select"}</strong></div>
          </div>
        </div>
        <h5>{"Configure Access Controls → Session"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"17"}</div>
            <div className="step-t">{"Under "}<strong>{"Access controls"}</strong>{", click "}<strong>{"Session"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"18"}</div>
            <div className="step-t">{"Check "}<strong>{"Sign-in frequency"}</strong>{" → choose "}<strong>{"Periodic reauthentication"}</strong>{" → enter "}<code>{"9"}</code>{" and select "}<strong>{"Hours"}</strong>{". Why 9: a typical workday is 8-9 hours, so users authenticate once at start of day, not every time they reconnect to their AVD session during the day"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"19"}</div>
            <div className="step-t">{"Click "}<strong>{"Select"}</strong>{" to confirm Session controls"}</div>
          </div>
        </div>
        <h5>{"Set Policy State and Save"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"20"}</div>
            <div className="step-t">{"At the very bottom of the policy blade, find "}<strong>{"Enable policy"}</strong>{". Set it to "}<strong>{"Report-only"}</strong>{" (not \"On\" yet). Report-only evaluates the policy on every sign-in and logs what "}<em>{"would"}</em>{" have happened, but doesn't actually enforce — lets you verify the policy works without locking users out"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"21"}</div>
            <div className="step-t">{"Click "}<strong>{"Create"}</strong>{" at the bottom of the blade"}</div>
          </div>
        </div>
        <h5>{"Monitor in Report-Only Mode, Then Activate"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"22"}</div>
            <div className="step-t">{"Leave the policy in Report-only for 24-48 hours. During this period, sign in as test users and check "}<strong>{"Monitoring & health → Sign-in logs → Conditional Access"}</strong>{" tab — each sign-in shows whether the policy "}<em>{"would have"}</em>{" required MFA, blocked, or granted"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"23"}</div>
            <div className="step-t">{"Once you've verified no break-glass accounts or service principals are being unintentionally affected: edit the policy → change "}<strong>{"Enable policy"}</strong>{" from Report-only to "}<strong>{"On"}</strong>{" → click "}<strong>{"Save"}</strong></div>
          </div>
        </div>
        <div className="ib danger"><b>{"AVD-Specific Gotcha — Don't Require \"Compliant Device\" Yet"}</b>{"It's tempting to add "}<strong>{"Require device to be marked as compliant"}</strong>{" to the Grant controls for stronger security. "}<strong>{"Do not"}</strong>{" add this requirement for AVD policies unless every session host is fully Intune-compliant first. During AVD scale-out, new session hosts can briefly fail compliance evaluation and lock every user out. Save the compliant-device requirement for a later hardening phase after the environment is stable."}</div>
        <div className="ib tip"><b>{"Why Sign-In Frequency Goes Under Session, Not Grant"}</b>{"The Grant section controls "}<em>{"whether"}</em>{" a sign-in is allowed. The Session section controls "}<em>{"how the session behaves"}</em>{" over time. Sign-in frequency is a session attribute — it doesn't change the initial grant decision, but forces re-authentication every N hours during ongoing sessions. Splitting these into two sections is one of CA's design choices that confuses many junior admins."}</div>
      </div>
      <div className="phase" id="p5">
        <div className="phase-num">{"05"}</div>
        <h2>{"Azure Virtual Desktop Build"}</h2>
        <p>{"This is the workspace layer. Multi-session Windows 11 + M365 Apps pre-installed + FSLogix for profile persistence."}</p>
      </div>
      <div className="sec" id="s50">
        <h3>{"Step 5.0 — Network & Identity Architecture Decision"}</h3>
        <p>{"Before creating the host pool, you have an architectural decision to make. The choice you make here determines whether the previous phases' on-prem GPO work directly applies to your session hosts, and whether you need to invest in network connectivity between Azure and on-prem. This decision is invisible in most AVD guides but is one of the most consequential ones in the build."}</p>
        <h4>{"Why This Decision Matters"}</h4>
        <p>{"The earlier phases of this guide built an on-prem AD domain ("}<code>{"lab.m100labs.com"}</code>{") on Hyper-V, configured GPOs that target an AVD OU, and set up Entra Connect Sync to synchronize identities to the cloud. That works perfectly as long as the AVD session hosts can "}<strong>{"reach the on-prem domain controller"}</strong>{" — they need it for domain join, Kerberos authentication on every sign-in, GPO retrieval, and DNS resolution of AD records."}</p>
        <p>{"If you create AVD session hosts in Azure with no network path back to your on-prem DC, the domain join will fail. The session hosts have no way to find "}<code>{"_ldap._tcp.dc._msdcs.lab.m100labs.com"}</code>{", can't authenticate Kerberos tickets, and can't apply your Phase 3 GPOs. This is the architectural gap most lab guides skip over."}</p>
        <div className="ib tip"><b>{"This Guide Recommends the Hybrid Path (Option A or B) — Here's Why"}</b>{"You'll see Microsoft and many cloud-native guides recommend Option C (Entra-only) as the \"modern\" path. That recommendation is technically accurate for new greenfield deployments, but it's the wrong default for a cloud engineer or sysadmin building skills. This guide instead recommends going through the hybrid path because:"}<br /><br />{" "}<strong>{"Skill durability."}</strong>{" 70%+ of mid-to-large enterprises still run on-prem AD with GPO as the primary configuration mechanism. GPO has worked identically since 2007 — the Intune portal reorganizes every 18 months. Investing in concepts that outlive the next UI redesign is the safer career bet."}<br /><br />{" "}<strong>{"Conceptual foundation."}</strong>{" Intune Settings Catalog is GPO with a cloud control plane. The settings, ADMX templates, and registry mappings are inherited from the GPO world. You can't really understand what an Intune Configuration Profile is doing without understanding the registry value it's writing — and that mapping is documented in GPO terms. Skipping GPO to \"learn modern\" is like learning a framework without learning the language it's built on."}<br /><br />{" "}<strong>{"Troubleshooting transferability."}</strong>{" When something breaks in Intune, you reach for the same tools used in GPO troubleshooting: registry inspection, gpresult-style analysis, event logs. Admins who learned GPO first can debug Intune. Admins who only know Intune often can't — they lack the underlying vocabulary."}<br /><br />{" "}<strong>{"Interview signal."}</strong>{" \"I built a hybrid AD environment with on-prem GPO, configured Entra Connect, set up FSLogix on SMB with proper NTFS ACLs, and deployed AVD with hybrid join over S2S VPN\" is a vastly stronger answer than \"I deployed AVD with Entra-only join and used Intune Settings Catalog.\" The first demonstrates depth across multiple domains. The second demonstrates portal navigation."}<br /><br />{" "}<strong>{"Resilience and war stories."}</strong>{" The hard path is where the actual learning happens. Hitting CGNAT walls teaches you what S2S VPN actually requires. Debugging GPO inheritance forces LSDOU and Loopback to become muscle memory. Setting up FSLogix NTFS permissions teaches the Creator Owner pattern. These are the experiences interviewers probe for. Option C is too smooth — you don't accumulate the war stories."}<br /><br />{" "}<strong>{"Portfolio differentiation."}</strong>{" Anyone with $200 and an afternoon can spin up an Entra-only AVD deployment from the Microsoft Quickstart. What makes a portfolio piece distinctive is the hybrid complexity nobody else bothered with — networking, identity federation, storage permissions, multi-site AD considerations. That's the candidate who gets remembered."}<br /><br />{" "}<strong>{"The mid-career reality."}</strong>{" Any senior role at an established enterprise will expect you to know GPO. \"But Microsoft said to use Intune now\" isn't an answer when there are 50,000 GPO-managed endpoints. Knowing GPO isn't optional for any cloud or sysadmin career arc longer than 3 years."}<br /><br />{" "}<strong>{"If you're building a portfolio piece or learning cloud and sysadmin skills end-to-end, choose Option A or B."}</strong>{" The Phase 3 GPO work you've already done is core curriculum, not \"alternative content.\" Option C is documented in this guide as the modern target architecture worth understanding, but it's not the default for learners."}</div>
        <h4>{"The Three Architectures"}</h4>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Architecture"}</th>
                <th>{"Network Required"}</th>
                <th>{"Phase 3 GPOs Apply?"}</th>
                <th>{"Complexity"}</th>
                <th>{"Best For"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{"A. Hybrid + Site-to-Site VPN"}</strong><br />{"(Session hosts domain-joined to on-prem AD via VPN)"}</td>
                <td>{"S2S VPN between on-prem and Azure VNet"}</td>
                <td>{"Yes — direct application"}</td>
                <td>{"High"}</td>
                <td>{"Learning hybrid networking end-to-end; deep skill-building"}</td>
              </tr>
              <tr>
                <td><strong>{"B. Hybrid + Second DC in Azure"}</strong>{" "}<span style={{ color: "var(--accent)", fontWeight: "600" }}>{"← Recommended"}</span><br />{"(Deploy another DC as part of the same domain in Azure)"}</td>
                <td>{"S2S VPN initially (for AD replication), then self-sufficient"}</td>
                <td>{"Yes — direct application"}</td>
                <td>{"Medium-High"}</td>
                <td>{"Portfolio building; real enterprise pattern (multi-site AD); production-grade resilience"}</td>
              </tr>
              <tr>
                <td><strong>{"C. Entra-Only Joined Session Hosts"}</strong><br />{"(Skip on-prem AD for the AVD hosts entirely)"}</td>
                <td>{"None beyond internet"}</td>
                <td>{"No — configure via Intune instead"}</td>
                <td>{"Low"}</td>
                <td>{"Modern target architecture for new deployments; greenfield production; quick proof-of-concept"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4>{"The Modern Direction — Why Microsoft Pushes Entra-Only"}</h4>
        <p>{"Microsoft's product direction has been shifting toward Entra-only joined session hosts for the last 3-4 years, and for good architectural reasons:"}</p>
        <ul>
          <li><strong>{"No network dependency on legacy AD."}</strong>{" Session hosts that don't need to reach a DC are vastly simpler to deploy, scale, and operate. Multi-region AVD becomes trivial."}</li>
          <li><strong>{"Single identity plane."}</strong>{" Users still come from on-prem via Entra Connect, but the session hosts only see Entra. There's one authentication path, not two."}</li>
          <li><strong>{"Modern configuration via Intune."}</strong>{" Settings that used to be GPO move to Intune Configuration Profiles and Settings Catalog. The configuration model is the same regardless of where the device is in the world."}</li>
          <li><strong>{"Conditional Access works natively."}</strong>{" Hybrid join requires an extra registration dance with Entra; cloud-only is registered with Entra by definition."}</li>
          <li><strong>{"FSLogix on Azure Files with Entra Kerberos."}</strong>{" The Azure Files + Entra Kerberos combination removes the need for any on-prem AD for profile storage — a pattern that's only available in cloud-native deployments."}</li>
        </ul>
        <p>{"For new deployments today, Microsoft's recommended pattern is: identities sync from AD via Entra Connect (for legacy app compatibility on existing endpoints), but new AVD session hosts go Entra-only joined. This is the direction the documentation has been moving since 2023 and is now the default in the AVD Quickstart."}</p>
        <h4>{"Why a Second DC in Azure Often Wins in Enterprise"}</h4>
        <p>{"Pure Entra-only is the modern direction, but it isn't always practical for existing enterprises. If you have legacy line-of-business applications that authenticate via Kerberos or NTLM, or printers and file shares that rely on traditional AD, you need a DC reachable from your session hosts. In that case, deploying a "}<strong>{"second DC in Azure"}</strong>{" is usually the right architectural answer:"}</p>
        <ul>
          <li><strong>{"Latency."}</strong>{" Session hosts talk to a DC in the same Azure region — sub-millisecond auth instead of going over a VPN tunnel that adds 20-100ms per round trip"}</li>
          <li><strong>{"Resilience."}</strong>{" If the VPN drops, session hosts continue functioning. Users can still sign in. The on-prem DC is just one of multiple replication partners"}</li>
          <li><strong>{"Capacity isolation."}</strong>{" Authentication load from Azure workloads doesn't impact your on-prem DCs"}</li>
          <li><strong>{"VPN scope reduces."}</strong>{" The VPN becomes a replication and management path only — not a critical user-traffic path"}</li>
          <li><strong>{"Closest match to enterprise patterns."}</strong>{" Real enterprises run DCs in every site that has workloads. Azure is just another site"}</li>
        </ul>
        <p>{"This pattern (S2S VPN + DC in Azure) is the most realistic enterprise architecture and the best learning target if you want to understand how real organizations run AVD."}</p>
        <h4>{"Site-to-Site VPN — When You Choose This Path"}</h4>
        <p>{"If you choose Option A or B above, you need a Site-to-Site VPN between your on-prem network and an Azure VNet. Here's the conceptual setup. (Each step has Microsoft Learn documentation linked from the Azure portal during creation — this is the high-level flow.)"}</p>
        <h5>{"Prerequisites"}</h5>
        <ul>
          <li><strong>{"Static public IP on the on-prem side."}</strong>{" Most residential ISPs use CGNAT (Carrier-Grade NAT) which makes S2S VPN impossible. Check with your ISP — you may need to pay for a static IP add-on, or use a dynamic DNS service if your IP rotates infrequently. "}<strong>{"This is the most common deal-breaker for home labs."}</strong></li>
          <li><strong>{"A VPN-capable device on-prem."}</strong>{" Options: a commercial firewall (pfSense, OPNsense, Unifi, Fortinet, Cisco ASA), a Windows Server with RRAS, or a router with IKEv2 IPSec support. Most consumer routers don't support this"}</li>
          <li><strong>{"Non-overlapping IP address spaces."}</strong>{" Your on-prem network (currently "}<code>{"10.100.1.0/24"}</code>{") and your Azure VNet must not overlap. Pick something like "}<code>{"10.200.0.0/16"}</code>{" for Azure"}</li>
          <li><strong>{"Budget."}</strong>{" Azure VPN Gateway costs roughly "}<strong>{"$30-150/month"}</strong>{" depending on SKU. VpnGw1 (~$140/mo) is the recommended starting SKU since Basic SKU was deprecated. Outbound data is billed at standard egress rates"}</li>
        </ul>
        <div className="ib warn"><b>{"Bypassing CGNAT — What Works and What Doesn't"}</b>{"If your residential ISP doesn't provide a usable static public IP, here are the realistic alternatives:"}<br /><br />{" "}<strong>{"✗ Commercial VPN provider \"static IPs\" (NordVPN, ExpressVPN, etc.) — DOES NOT WORK"}</strong><br />{" These provide "}<em>{"outbound"}</em>{" static IPs for client privacy. They don't accept inbound IPSec connections from Azure, don't allow port forwarding to your home, and most explicitly forbid running servers in their terms of service. The IP belongs to their infrastructure, not your network. Azure would try to establish a tunnel to their server, not to your home."}<br /><br />{" "}<strong>{"✓ VPS relay (~$5/month) — best for learning production patterns"}</strong><br />{" Rent a VPS from DigitalOcean, Hetzner, Vultr, or similar. Get a real static public IP. Run WireGuard or OpenVPN on the VPS connecting outbound to your home network. Azure S2S VPN terminates at the VPS, which relays to your home. One extra hop, real public endpoint, cheap."}<br /><br />{" "}<strong>{"✓ Mesh VPN overlay (free) — best for fast lab setup"}</strong><br />{" Tailscale or ZeroTier create encrypted peer-to-peer networks that traverse CGNAT via UDP hole-punching. Install the client on Azure VMs, your on-prem DC, and management workstation. Free tiers cover lab-scale device counts. Not a traditional S2S VPN — each machine becomes a mesh peer — so the network model differs from enterprise S2S, but connectivity works."}<br /><br />{" "}<strong>{"✓ Cloudflare Tunnel (free) — application-layer only"}</strong><br />{" Tunnel specific services (RDP, HTTP, SSH) outbound through Cloudflare's network. Works around CGNAT entirely. Good for accessing specific services from Azure, but doesn't enable the network-layer connectivity needed for domain join."}<br /><br />{" "}<strong>{"✓ ISP business plan or static IP add-on ($5-20/month) — cleanest if available"}</strong><br />{" Comcast Business, AT&T Business, or your ISP's residential static IP add-on. Same line, different tier. Real public IP, real inbound connectivity, no workarounds."}<br /><br />{" "}<strong>{"✓ Skip the whole problem with Option C (Entra-only)"}</strong><br />{" None of this matters if your session hosts don't need to reach an on-prem DC. For a home lab, this is the highest-value option for time invested."}</div>
        <h5>{"Azure-Side Setup"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"In "}<code>{"portal.azure.com"}</code>{", create a new "}<strong>{"Virtual Network"}</strong>{" (e.g., "}<code>{"vnet-avd-prod"}</code>{") with address space "}<code>{"10.200.0.0/16"}</code>{" in the same region you'll deploy AVD"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Add two subnets: "}<code>{"snet-avd-hosts"}</code>{" ("}<code>{"10.200.1.0/24"}</code>{") for session hosts, and "}<code>{"GatewaySubnet"}</code>{" ("}<code>{"10.200.255.0/27"}</code>{") — "}<strong>{"the name must be exactly "}<code>{"GatewaySubnet"}</code></strong>{", this is a special reserved name Azure recognizes"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Create a "}<strong>{"Virtual Network Gateway"}</strong>{": search the portal for \"Virtual network gateways\" → Create. Settings: Gateway type = "}<strong>{"VPN"}</strong>{", VPN type = "}<strong>{"Route-based"}</strong>{", SKU = "}<strong>{"VpnGw1"}</strong>{" (or higher), VNet = your AVD VNet, Public IP = create new. "}<strong>{"Provisioning takes 30-45 minutes"}</strong>{" — go get coffee"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Once the VPN Gateway exists, note its public IP address (under Overview)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Create a "}<strong>{"Local Network Gateway"}</strong>{": this represents your on-prem network in Azure's view. Set the IP to your on-prem public IP, and address space to "}<code>{"10.100.1.0/24"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Create a "}<strong>{"VPN Connection"}</strong>{": on your Virtual Network Gateway → Connections → +Add. Type = Site-to-site (IPsec), Local Network Gateway = the one you just created, generate a "}<strong>{"Pre-Shared Key (PSK)"}</strong>{" and save it somewhere safe — you'll need it on the on-prem side"}</div>
          </div>
        </div>
        <h5>{"On-Prem Side Setup"}</h5>
        <p>{"Exact steps depend on your VPN device — Microsoft maintains "}<a href="https://learn.microsoft.com/azure/vpn-gateway/vpn-gateway-about-vpn-devices">{"supported device list"}</a>{" with configuration scripts. The conceptual steps:"}</p>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"7"}</div>
            <div className="step-t">{"Configure an IPSec/IKEv2 tunnel on your VPN device pointing to the Azure VPN Gateway public IP from Step 4"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"8"}</div>
            <div className="step-t">{"Set the Pre-Shared Key to match what you generated in Step 6"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"9"}</div>
            <div className="step-t">{"Define traffic selectors: local subnet = "}<code>{"10.100.1.0/24"}</code>{", remote subnet = "}<code>{"10.200.0.0/16"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"10"}</div>
            <div className="step-t">{"Match IPSec/IKE parameters to Azure defaults (AES256, SHA256, DH Group 14 or higher) — Azure's docs list current crypto suites"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"11"}</div>
            <div className="step-t">{"For Windows Server with RRAS: install the Remote Access role, run the RRAS configuration wizard, choose \"Secure connection between two private networks,\" and enter Azure details"}</div>
          </div>
        </div>
        <h5>{"DNS — The Step Everyone Forgets"}</h5>
        <p>{"Once the VPN tunnel is up, Azure VMs still can't find your on-prem DC unless DNS is configured properly. Two parts:"}</p>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"12"}</div>
            <div className="step-t">{"On the AVD VNet, configure "}<strong>{"Custom DNS servers"}</strong>{" = your on-prem DC IP ("}<code>{"10.100.1.10"}</code>{"). VNet → DNS servers → Custom → enter the IP. This makes Azure VMs use your on-prem DC for DNS resolution, so they can find AD records"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"13"}</div>
            <div className="step-t">{"Restart any Azure VMs that were created before this change — DNS settings only apply at boot"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"14"}</div>
            <div className="step-t">{"On the on-prem DC, ensure DNS is listening on the LAN interface and that your firewall allows inbound DNS (port 53 TCP/UDP) from the Azure VNet address space"}</div>
          </div>
        </div>
        <h5>{"Validate Before Building Session Hosts"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"15"}</div>
            <div className="step-t">{"In Azure, create a small test VM in the AVD VNet (no domain join yet). From that VM, ping "}<code>{"10.100.1.10"}</code>{" (your on-prem DC). If ping is blocked by firewall, test with "}<code>{"Test-NetConnection 10.100.1.10 -Port 389"}</code>{" (LDAP)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"16"}</div>
            <div className="step-t">{"From the same test VM, try "}<code>{"nslookup lab.m100labs.com"}</code>{" — it should resolve to your DC. If it fails, the custom DNS in Step 12 isn't applying yet (reboot the VM)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"17"}</div>
            <div className="step-t">{"Try "}<code>{"Test-ComputerSecureChannel"}</code>{" after manual domain join — confirms the trust path is working"}</div>
          </div>
        </div>
        <p>{"Only after these tests pass should you proceed to create AVD session hosts. Otherwise you'll spend hours troubleshooting domain join failures that are actually network failures."}</p>
        <h4>{"Recommendation Matrix"}</h4>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Your Goal"}</th>
                <th>{"Recommended Architecture"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{"Building skills end-to-end for a cloud engineer / sysadmin role"}</strong>{" (the most common reader)"}</td>
                <td><strong>{"Option B"}</strong>{" — Second DC in Azure with S2S VPN. Teaches networking, hybrid identity, GPO, and matches how real enterprises actually run AVD. Highest learning ROI"}</td>
              </tr>
              <tr>
                <td>{"Building a portfolio piece for interviews"}</td>
                <td><strong>{"Option B"}</strong>{" — Same reasoning. Hybrid complexity is what differentiates a portfolio"}</td>
              </tr>
              <tr>
                <td>{"Production deployment with legacy app dependencies"}</td>
                <td><strong>{"Option B"}</strong>{" — Don't make session host authentication depend on a VPN tunnel that could fail"}</td>
              </tr>
              <tr>
                <td>{"Learning hybrid networking deeply without the DC-in-Azure step"}</td>
                <td><strong>{"Option A"}</strong>{" — S2S VPN only. Forces you to internalize every cross-boundary concept. Worth doing once"}</td>
              </tr>
              <tr>
                <td>{"Greenfield production deployment, no legacy AD constraints, cloud-only strategy"}</td>
                <td><strong>{"Option C"}</strong>{" — Entra-only joined with Azure Files + Entra Kerberos. The modern target architecture"}</td>
              </tr>
              <tr>
                <td>{"You only need a working AVD deployment as fast as possible with no learning interest in identity or networking"}</td>
                <td><strong>{"Option C"}</strong>{" — Be honest with yourself that this is what you want. It will work, just don't expect it to teach you cloud engineering or sysadmin skills"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ib tip"><b>{"What Changes If You Pick Option C (Entra-Only)"}</b>{"Phase 3 GPO work is core curriculum regardless of which architecture you ultimately deploy — those concepts apply to your on-prem MGMT01 and every other hybrid-joined endpoint, plus they're the foundation that Intune Settings Catalog is built on. If you pick Option C for the AVD session hosts specifically, here's what changes: "}<strong>{"FSLogix, OneDrive KFM, Office SCA, and Outlook Cached settings move to Intune Configuration Profiles instead of GPO."}</strong>{" The setting values are identical — only the delivery mechanism changes. Phase 4.1 hybrid join configuration also doesn't apply to these specific hosts (they're cloud-only joined). Conditional Access and Intune auto-enrollment from Phase 4 apply unchanged. See Steps 5.0b and 5.0c for the Option C-specific setup."}</div>
        <div className="ib note"><b>{"Address Space Hygiene — A Common Lab Trap"}</b>{"If your on-prem Hyper-V network is "}<code>{"192.168.x.x"}</code>{" and your home router LAN is also "}<code>{"192.168.x.x"}</code>{", you may have overlap problems even before adding Azure. Plan your address spaces upfront: on-prem private subnet, home LAN subnet, and Azure VNet subnet must all be distinct. The lab convention used in this guide ("}<code>{"10.100.1.0/24"}</code>{" on-prem, "}<code>{"10.200.0.0/16"}</code>{" in Azure) avoids the common "}<code>{"192.168.x.x"}</code>{" collisions."}</div>
      </div>
      <div className="sec" id="s50b">
        <h3>{"Step 5.0b — Group Setup for Option C (Entra-Only)"}</h3>
        <p>{"This step and Step 5.0c only apply if you chose "}<strong>{"Option C"}</strong>{" in Step 5.0. If you chose Option A or B (the recommended learning paths), skip ahead to Step 5.1 — your Phase 3 GPOs are already configured to handle FSLogix, OneDrive, SCA, and Outlook settings via on-prem AD, and your session hosts will pick them up after domain join."}</p>
        <p>{"For Option C readers: the path is groups first, then configuration profiles target those groups, then session hosts auto-populate the groups once they enroll. Doing the order in reverse leaves a window where session hosts exist with no configuration applied."}</p>
        <h4>{"Why Groups First"}</h4>
        <ul>
          <li><strong>{"Dynamic groups take time to evaluate."}</strong>{" Newly-created dynamic device groups can take 5-30 minutes for membership to populate. Creating them before hosts exist means they're ready and evaluating when hosts come online"}</li>
          <li><strong>{"Configuration Profiles need targets."}</strong>{" Each Intune Configuration Profile is assigned to a group. You can create profiles before devices exist, and they apply the moment matching devices enroll"}</li>
          <li><strong>{"Pilot/production split needs separate groups."}</strong>{" You'll stage policies on a small pilot group first, then expand to full production. Creating both groups upfront avoids re-configuring assignments later"}</li>
        </ul>
        <h4>{"Existing Groups That Carry Over"}</h4>
        <p>{"These groups from Step 1.4 work unchanged in Option C — keep using them:"}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Group"}</th>
                <th>{"Source"}</th>
                <th>{"Purpose in Option C"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>{"GRP-AD-AVD-Users"}</code></td>
                <td>{"AD-sourced (synced via Entra Connect)"}</td>
                <td>{"AVD application group assignment — controls which users see the AVD desktop in Windows App"}</td>
              </tr>
              <tr>
                <td><code>{"GRP-CLOUD-CA-Excluded"}</code></td>
                <td>{"Cloud-only"}</td>
                <td>{"Break-glass exclusion from Conditional Access policies (set up in Step 4.2)"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4>{"New Device Groups for Option C"}</h4>
        <h5>{"Create GRP-CLOUD-AVD-Devices (Dynamic)"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"In "}<code>{"entra.microsoft.com"}</code>{", navigate to "}<strong>{"Groups → All groups → + New group"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Group type: "}<strong>{"Security"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Group name: "}<code>{"GRP-CLOUD-AVD-Devices"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Description: "}<code>{"Dynamic membership: all AVD session hosts. Target for Intune Configuration Profiles."}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Microsoft Entra roles can be assigned to the group: "}<strong>{"No"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Membership type: "}<strong>{"Dynamic Device"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"7"}</div>
            <div className="step-t">{"Click "}<strong>{"Add dynamic query"}</strong>{". Switch to the "}<strong>{"Edit"}</strong>{" tab (easier than the visual builder for this rule). Enter:"}<br />{" "}<code>{"(device.displayName -startsWith \"hp-contoso-prod-\") -and (device.deviceOSType -eq \"Windows\")"}</code><br />{" Adjust the prefix to match your AVD VM naming convention from Step 5.2. Click "}<strong>{"Save"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"8"}</div>
            <div className="step-t">{"Click "}<strong>{"Create"}</strong>{". The group is empty for now — devices auto-populate after they deploy and enroll"}</div>
          </div>
        </div>
        <div className="ib tip"><b>{"Why Dynamic Over Assigned for Devices"}</b>{"AVD session hosts come and go with autoscale and image updates. A dynamic group based on naming convention means new hosts automatically inherit the right policies without manual assignment — critical for any deployment that will scale beyond your initial test hosts. Assigned groups (next) are fine for a small static pilot subset."}</div>
        <h5>{"Create GRP-CLOUD-AVD-Pilot-Devices (Assigned)"}</h5>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Groups → All groups → + New group"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Group type: "}<strong>{"Security"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Group name: "}<code>{"GRP-CLOUD-AVD-Pilot-Devices"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Description: "}<code>{"Manually-assigned subset of AVD session hosts for staged policy rollout."}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Microsoft Entra roles can be assigned: "}<strong>{"No"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Membership type: "}<strong>{"Assigned"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"7"}</div>
            <div className="step-t">{"Skip the Members blade — no hosts exist yet. Click "}<strong>{"Create"}</strong></div>
          </div>
        </div>
        <p>{"You'll add the first 1-2 session hosts to this group after they deploy in Step 5.1, validate policies behave correctly, then expand the configuration profile scope to the broader "}<code>{"GRP-CLOUD-AVD-Devices"}</code>{"."}</p>
      </div>
      <div className="sec" id="s50c">
        <h3>{"Step 5.0c — Configuration Profiles for Option C (GPO Equivalents)"}</h3>
        <p>{"This step also only applies to Option C. It translates each Phase 3 GPO into its Intune Configuration Profile equivalent. The settings and values are identical — only the delivery mechanism changes. After this step, your Entra-only joined session hosts will receive the same FSLogix, OneDrive, Office SCA, and Outlook configuration that Phase 3 delivered via GPO."}</p>
        <h4>{"Why Settings Catalog Over ADMX Import"}</h4>
        <p>{"Intune offers three ways to configure devices: "}<strong>{"Settings Catalog"}</strong>{" (modern, Microsoft-maintained), "}<strong>{"Administrative Templates"}</strong>{" (Microsoft's bundled ADMX), and "}<strong>{"Imported ADMX"}</strong>{" (custom/third-party). For AVD on Entra-only joined Windows multi-session, "}<strong>{"Settings Catalog is the preferred path"}</strong>{":"}</p>
        <ul>
          <li><strong>{"FSLogix is in Settings Catalog since October 2023"}</strong>{" — no ADMX import needed"}</li>
          <li><strong>{"Imported ADMX often returns \"Not Applicable\""}</strong>{" on Windows multi-session AVD hosts — a known limitation Microsoft acknowledges in their docs"}</li>
          <li><strong>{"Settings Catalog includes search and category filtering"}</strong>{" — easier to find the exact setting"}</li>
          <li><strong>{"Better long-term support"}</strong>{" — Microsoft is actively adding settings to Settings Catalog while ADMX import is in maintenance mode"}</li>
        </ul>
        <h4>{"Phase 3 GPO → Intune Mapping"}</h4>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Phase 3 GPO"}</th>
                <th>{"Intune Equivalent"}</th>
                <th>{"Settings Catalog Category"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"AVD-FSLogix-Profile-v1"}</td>
                <td>{"Configuration Profile (Settings Catalog)"}</td>
                <td>{"FSLogix > Profile Containers"}</td>
              </tr>
              <tr>
                <td>{"AVD-Office-SCA-v1"}</td>
                <td>{"Configuration Profile (Settings Catalog)"}</td>
                <td>{"Microsoft Office 2016 (Machine) > Microsoft Office 2016 (Machine) > Licensing Settings"}</td>
              </tr>
              <tr>
                <td>{"AVD-OneDrive-KFM-v1"}</td>
                <td>{"Configuration Profile (Settings Catalog)"}</td>
                <td>{"OneDrive"}</td>
              </tr>
              <tr>
                <td>{"AVD-Outlook-Cached-v1"}</td>
                <td>{"Configuration Profile (Settings Catalog)"}</td>
                <td>{"Microsoft Outlook 2016 > Account Settings > Exchange > Cached Exchange Mode"}</td>
              </tr>
              <tr>
                <td>{"AVD-System-Loopback-v1"}</td>
                <td><strong>{"Not needed"}</strong></td>
                <td>{"n/a — loopback is a GPO mechanism for applying user settings via computer object. Intune applies user settings to devices natively when the device is in scope"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4>{"Common Workflow — Creating Any Configuration Profile"}</h4>
        <p>{"Every profile below follows this pattern. Read this once, then each profile section only lists the unique settings:"}</p>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"A"}</div>
            <div className="step-t">{"In "}<code>{"intune.microsoft.com"}</code>{", navigate to "}<strong>{"Devices → Manage devices → Configuration"}</strong>{" → "}<strong>{"+ Create → New Policy"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"B"}</div>
            <div className="step-t">{"Platform: "}<strong>{"Windows 10 and later"}</strong>{". Profile type: "}<strong>{"Settings catalog"}</strong>{". Click "}<strong>{"Create"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"C"}</div>
            <div className="step-t">{"Name and Description (per profile, listed below) → "}<strong>{"Next"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"D"}</div>
            <div className="step-t">{"Configuration settings → "}<strong>{"+ Add settings"}</strong>{" → search for the category → check the settings → close the picker → configure values"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"E"}</div>
            <div className="step-t">{"Next through Scope tags. On Assignments, add the group from Step 5.0b. Next, then "}<strong>{"Create"}</strong></div>
          </div>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />
        <h4>{"Profile 1: AVD-FSLogix-Profile (Settings Catalog)"}</h4>
        <p><strong>{"Name:"}</strong>{" "}<code>{"AVD-FSLogix-Profile"}</code>{" | "}<strong>{"Assign to:"}</strong>{" "}<code>{"GRP-CLOUD-AVD-Pilot-Devices"}</code>{" first, then expand"}</p>
        <p>{"In Settings Catalog, search "}<strong>{"FSLogix"}</strong>{" → expand "}<strong>{"Profile Containers"}</strong>{". Settings to enable and configure:"}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Setting"}</th>
                <th>{"Value"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"Enabled"}</td>
                <td>{"Enabled (1)"}</td>
              </tr>
              <tr>
                <td>{"VHD Locations"}</td>
                <td>{"Your Azure Files share UNC — e.g., "}<code>{"\\\\stcontosoprod.file.core.windows.net\\fslogix"}</code></td>
              </tr>
              <tr>
                <td>{"Size In MBs"}</td>
                <td><code>{"30000"}</code></td>
              </tr>
              <tr>
                <td>{"Delete Local Profile When VHD Should Apply"}</td>
                <td>{"Enabled (1)"}</td>
              </tr>
              <tr>
                <td>{"Flip Flop Profile Directory Name"}</td>
                <td>{"Enabled (1)"}</td>
              </tr>
              <tr>
                <td>{"Volume Type"}</td>
                <td>{"VHDX"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ib warn"><b>{"Storage Backend Changes for Entra-Only"}</b>{"For Entra-only joined hosts, your FS01 Hyper-V file share isn't reachable (no S2S VPN). FSLogix must point to "}<strong>{"Azure Files"}</strong>{" with one of these auth options: "}<strong>{"Entra Kerberos"}</strong>{" (preferred — no DC needed), "}<strong>{"Entra Domain Services"}</strong>{", or "}<strong>{"storage account key"}</strong>{" (lab-only, not for production). Configuring Azure Files with Entra Kerberos is its own setup outside the scope of this step — see Microsoft Learn: \"Store FSLogix profile containers on Azure Files using Microsoft Entra ID.\""}</div>
        <div className="ib note"><b>{"Bonus Setting for Entra Kerberos"}</b>{"If using Entra Kerberos auth, also add this setting in the same profile: search Settings Catalog for "}<strong>{"Kerberos"}</strong>{" → enable "}<strong>{"Allow retrieving the Azure AD Kerberos Ticket Granting Ticket during logon"}</strong>{" (the "}<code>{"CloudKerberosTicketRetrievalEnabled"}</code>{" setting). Without this, Entra-joined hosts can't retrieve Kerberos tickets for the Azure Files share."}</div>
        <h4>{"Profile 2: AVD-OneDrive-KFM (Settings Catalog)"}</h4>
        <p><strong>{"Name:"}</strong>{" "}<code>{"AVD-OneDrive-KFM"}</code>{" | "}<strong>{"Assign to:"}</strong>{" "}<code>{"GRP-CLOUD-AVD-Devices"}</code></p>
        <p>{"Search "}<strong>{"OneDrive"}</strong>{" in Settings Catalog. Configure:"}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Setting"}</th>
                <th>{"Value"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"Silently sign in users to the OneDrive sync app with their Windows credentials"}</td>
                <td>{"Enabled"}</td>
              </tr>
              <tr>
                <td>{"Silently move Windows known folders to OneDrive"}</td>
                <td>{"Enabled — provide your Entra tenant ID in the value field"}</td>
              </tr>
              <tr>
                <td>{"Use OneDrive Files On-Demand"}</td>
                <td>{"Enabled"}</td>
              </tr>
              <tr>
                <td>{"Prevent users from changing the location of their OneDrive folder"}</td>
                <td>{"Enabled"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h4>{"Profile 3: AVD-Office-SCA (Settings Catalog)"}</h4>
        <p><strong>{"Name:"}</strong>{" "}<code>{"AVD-Office-SCA"}</code>{" | "}<strong>{"Assign to:"}</strong>{" "}<code>{"GRP-CLOUD-AVD-Devices"}</code></p>
        <p>{"Search "}<strong>{"Microsoft Office 2016 (Machine)"}</strong>{" → "}<strong>{"Licensing Settings"}</strong>{" in Settings Catalog. Configure:"}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Setting"}</th>
                <th>{"Value"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"Use shared computer activation"}</td>
                <td>{"Enabled"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>{"The "}<code>{"SCLCacheOverride"}</code>{" and "}<code>{"SCLCacheOverrideDirectory"}</code>{" registry values from the Phase 3 GPO are "}<em>{"only needed if you're forcing the activation token to a specific location"}</em>{" (which the Phase 3 GPO did for FSLogix profile separation). For Settings Catalog deployments, this is typically unnecessary — but if you need it, use a second Configuration Profile of type "}<strong>{"Custom (OMA-URI)"}</strong>{" with the registry settings."}</p>
        <h4>{"Profile 4: AVD-Outlook-Cached (Settings Catalog)"}</h4>
        <p><strong>{"Name:"}</strong>{" "}<code>{"AVD-Outlook-Cached"}</code>{" | "}<strong>{"Assign to:"}</strong>{" "}<code>{"GRP-CLOUD-AVD-Devices"}</code></p>
        <p>{"Search "}<strong>{"Microsoft Outlook 2016"}</strong>{" → "}<strong>{"Account Settings → Exchange → Cached Exchange Mode"}</strong>{" in Settings Catalog. Configure:"}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"Setting"}</th>
                <th>{"Value"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{"Use Cached Exchange Mode for new and existing Outlook profiles"}</td>
                <td>{"Enabled"}</td>
              </tr>
              <tr>
                <td>{"Cached Exchange Mode Sync Settings"}</td>
                <td>{"3 months"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>{"Unlike the Phase 3 GPO version, there's no Loopback configuration needed — Intune applies user-scoped settings to the device automatically when the device is in scope, regardless of who signs in."}</p>
        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "1.5rem 0" }} />
        <h4>{"Validation"}</h4>
        <p>{"After all profiles are created (still no session hosts existing), in Intune go to "}<strong>{"Devices → Configuration"}</strong>{". You should see all four profiles listed with assignments showing your two device groups. "}<strong>{"Status will show \"0 devices\" until session hosts deploy and enroll"}</strong>{" — that's expected. Profile evaluation happens within ~8 hours of device enrollment."}</p>
        <p>{"For session-host-side verification once hosts exist, use the same pattern as the Phase 3 GPO verification but check Intune-side: "}<strong>{"Devices → Configuration → [profile] → Device status"}</strong>{" shows per-device application state for each setting."}</p>
      </div>
      <div className="sec" id="s51">
        <h3>{"Step 5.1 — Create the Host Pool"}</h3>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Sign in to "}<code>{"portal.azure.com"}</code>{" as a user with Contributor + User Access Administrator (or Owner) on the target subscription"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"In the top search bar, type "}<strong>{"Azure Virtual Desktop"}</strong>{" → select the service → in the left navigation of the AVD service blade, select "}<strong>{"Host pools"}</strong>{" → click "}<strong>{"+ Create"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Name: "}<code>{"hp-contoso-prod"}</code>{" | Location: same region as your AD"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Host pool type: "}<strong>{"Pooled"}</strong>{" (multi-session) | Load balancing: Breadth-first"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Max session limit: 8 per host (good starting point — tune later)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Validation environment: No (for prod)"}</div>
          </div>
        </div>
        <h3>{"Step 5.2 — Choose the VM Image"}</h3>
        <p>{"Microsoft publishes a gallery image specifically for AVD: "}<strong>{"\"Windows 11 Enterprise multi-session + Microsoft 365 Apps\""}</strong>{". This includes Office pre-installed with the right binary architecture — saves you hours."}</p>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"In the Virtual Machines tab, image: Browse all images → search \"Windows 11 Enterprise multi-session, version 24H2 + Microsoft 365 Apps\""}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"VM size: "}<code>{"Standard_D8s_v5"}</code>{" (8 vCPU, 32 GB RAM) for ~6 users per host"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Number of VMs: 2 (for testing — scale based on user count)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"VNet: the AVD VNet you chose in "}<strong>{"Step 5.0"}</strong>{". For Option A (S2S VPN), this is your Azure VNet with the VPN gateway. For Option B (DC in Azure), the VNet containing your Azure DC. For Option C (Entra-only), any VNet with internet egress — no path to on-prem needed"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Join the domain (Options A & B only): "}<strong>{"Active Directory"}</strong>{" → domain name "}<code>{"corp.contoso.local"}</code>{" → OU path "}<code>{"OU=HostPool-Prod,OU=AVD,OU=Contoso,DC=corp,DC=contoso,DC=local"}</code>{". For Option C (Entra-only): choose "}<strong>{"Microsoft Entra ID"}</strong>{" as the identity option instead, with optional Intune enrollment"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Provide a domain join account with permission on that OU (Options A & B only). For Option C, no AD credentials needed"}</div>
          </div>
        </div>
        <h3>{"Step 5.3 — Application Group & Workspace"}</h3>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"App group type: "}<strong>{"Desktop"}</strong>{" (full desktop, not RemoteApp)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Assign "}<code>{"GRP-AD-AVD-Users"}</code>{" as the assignment"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Create or register to workspace "}<code>{"ws-contoso-prod"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"After deployment, test by signing in to "}<strong>{"Windows App"}</strong>{" at "}<code>{"https://windows.cloud.microsoft"}</code>{" as a test user → your AVD desktop should appear in the workspace list → click to launch"}</div>
          </div>
        </div>
        <div className="ib danger"><b>{"Old AVD URLs Are Deprecated"}</b>{"If you've used AVD before, you may be familiar with "}<code>{"client.wvd.microsoft.com/arm/webclient"}</code>{" or "}<code>{"rdweb.wvd.microsoft.com/arm/webclient"}</code>{". "}<strong>{"These URLs were deprecated on March 27, 2026"}</strong>{" and the Remote Desktop web client is no longer supported for public cloud AVD environments. The current and only Microsoft-supported web client is "}<strong>{"Windows App"}</strong>{" at "}<code>{"windows.cloud.microsoft"}</code>{". The Remote Desktop MSI client extension lasts until September 28, 2026 for Azure Government and Azure China only. For all new deployments and testing, use Windows App."}</div>
        <div className="ib note"><b>{"Windows App vs Remote Desktop App"}</b>{"Windows App is Microsoft's unified client that replaces the older Remote Desktop app. It connects to AVD, Windows 365 Cloud PCs, Microsoft Dev Box, and on-prem Remote Desktop Services from a single interface. Available as a web client ("}<code>{"windows.cloud.microsoft"}</code>{"), Windows desktop app (Microsoft Store), iOS, Android, and macOS app. The older Microsoft Store \"Remote Desktop\" app reached end of support in September 2025."}</div>
      </div>
      <div className="sec" id="s52">
        <h3>{"Step 5.4 — Verify FSLogix on Session Hosts"}</h3>
        <p>{"The FSLogix file share was created back in "}<strong>{"Step 3.2"}</strong>{" and the FSLogix policies were configured via GPO in "}<strong>{"Step 3.3"}</strong>{". This step confirms the FSLogix agent is present on each session host and reading those policies correctly."}</p>
        <h4>{"Confirm the FSLogix Agent is Installed"}</h4>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"The Microsoft 365 + AVD gallery image used in Step 5.2 ships with FSLogix pre-installed. Confirm on each session host with "}<code>{"Get-ItemProperty 'HKLM:\\SOFTWARE\\FSLogix\\Apps'"}</code>{" — you should see version and install path values"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"If FSLogix is missing (custom image without the agent), download from "}<code>{"aka.ms/fslogix_download"}</code>{" and install "}<code>{"FSLogixAppsSetup.exe /install /quiet"}</code>{" on each host"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Verify the FSLogix GPO has applied: "}<code>{"gpresult /h C:\\Temp\\gpr.html"}</code>{" — confirm "}<code>{"AVD-FSLogix-Profile-v1"}</code>{" appears in Applied GPOs"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Sign in as a test user. After logon, browse to "}<code>{"\\\\FS01\\fslogix$"}</code>{" from an admin machine — you should see a new profile folder created for that user (named "}<code>{"USERNAME_SID"}</code>{" if Flip Flop Profile Directory Name is enabled)"}</div>
          </div>
        </div>
        <div className="ib warn"><b>{"FSLogix & Office Activation"}</b>{"The FSLogix Office Container can hold the M365 activation token. Modern guidance is to "}<strong>{"not"}</strong>{" include Office activation in the container if you're using Modern Authentication (which you are) — the token refreshes via the cloud each session. We'll handle activation specifically in Phase 6."}</div>
      </div>
      <div className="sec" id="s53">
        <h3>{"Step 5.5 — Verify Shared Computer Activation"}</h3>
        <p>{"SCA must be on, otherwise every M365 sign-in consumes a device license and they max out fast. Confirm:"}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"PowerShell — verify SCA"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# Run on a session host as admin"}</span>{"\n"}<span className="km">{"Get-ItemProperty"}</span>{" "}<span className="kk">{"-Path"}</span>{" "}<span className="ks">{"'HKLM:\\SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration'"}</span>{" |\n    "}<span className="km">{"Select-Object"}</span>{" SharedComputerLicensing, SCLCacheOverride, SCLCacheOverrideDirectory\n\n"}<span className="kc">{"# Expected output:\n# SharedComputerLicensing      : 1\n# SCLCacheOverride             : 1\n# SCLCacheOverrideDirectory    : %LOCALAPPDATA%\\Microsoft\\Office\\Licenses"}</span></code></pre>
        </div>
      </div>
      <div className="phase" id="p6">
        <div className="phase-num adv">{"06"}</div>
        <h2>{"The Crown Jewel — Automated Activation Remediation"}</h2>
        <p>{"This is the part that gets you hired. You'll build a production-grade Intune Remediation that detects M365 activation failures on AVD and fixes them without user or help desk involvement."}</p>
      </div>
      <div className="sec" id="s61">
        <h3>{"Step 6.1 — Root Cause Analysis"}</h3>
        <p>{"Microsoft 365 activation on AVD fails for a handful of well-documented reasons. Knowing them all is what makes this remediation work:"}</p>
        <div className="card">
          <div className="card-title">{"Cause 1 — Stale or Corrupted License Tokens"}</div>
          <div className="card-body">{"Activation tokens live in "}<code>{"%LOCALAPPDATA%\\Microsoft\\Office\\Licenses"}</code>{". When users hop between session hosts, tokens issued by one host can conflict with another. Tokens older than 30 days or zero-byte files indicate corruption."}</div>
        </div>
        <div className="card">
          <div className="card-title">{"Cause 2 — OneAuth / WAM Plugin Token Cache Conflicts"}</div>
          <div className="card-body">{"Modern Office uses the Web Account Manager (WAM) broker. The WAM token cache at "}<code>{"%LOCALAPPDATA%\\Microsoft\\OneAuth"}</code>{" can hold stale identities from previous sessions, causing the \"We couldn't activate your account\" error."}</div>
        </div>
        <div className="card">
          <div className="card-title">{"Cause 3 — Identity Registry Pollution"}</div>
          <div className="card-body">{"Office stores identity hints in "}<code>{"HKCU\\Software\\Microsoft\\Office\\16.0\\Common\\Identity"}</code>{". Orphaned entries from previous users (in shared session hosts) confuse the activation flow."}</div>
        </div>
        <div className="card">
          <div className="card-title">{"Cause 4 — Licensing Service Stopped"}</div>
          <div className="card-body">{"The Office Source Engine / Click-to-Run licensing service ("}<code>{"ClickToRunSvc"}</code>{") occasionally fails to start at user logon, especially on cold session hosts after autoscale spin-up."}</div>
        </div>
        <div className="card">
          <div className="card-title">{"Cause 5 — Network Block to Activation Endpoint"}</div>
          <div className="card-body">{"Activation traffic goes to "}<code>{"activation.sls.microsoft.com"}</code>{" on TCP 443. Strict NSG or firewall rules sometimes drop this."}</div>
        </div>
      </div>
      <div className="sec" id="s62">
        <h3>{"Step 6.2 — Detection Logic"}</h3>
        <p>{"Intune Remediations have two scripts: a "}<strong>{"Detection script"}</strong>{" (runs on a schedule, returns exit 1 if remediation needed) and a "}<strong>{"Remediation script"}</strong>{" (only runs when detection signals a problem). Here's the detection logic:"}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"Detect-M365ActivationIssue.ps1"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# ============================================================================\n# Script:    Detect-M365ActivationIssue.ps1\n# Purpose:   Detection for Intune Remediations — exit 1 if M365 activation\n#            issue is detected on this AVD session host\n# Author:    [Your Name]  |  Version: 1.0\n# ============================================================================"}</span>{"\n\n"}<span className="kv">{"$ErrorActionPreference"}</span>{" = "}<span className="ks">{"'SilentlyContinue'"}</span>{"\n"}<span className="kv">{"$issueFound"}</span>{" = "}<span className="kv">{"$false"}</span>{"\n"}<span className="kv">{"$reasons"}</span>{" = "}<span className="kv">{"@()"}</span>{"\n\n"}<span className="kc">{"# --- Check 1: SCA registry keys must be set ---"}</span>{"\n"}<span className="kv">{"$reg"}</span>{" = "}<span className="km">{"Get-ItemProperty"}</span>{" "}<span className="kk">{"-Path"}</span>{" "}<span className="ks">{"'HKLM:\\SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration'"}</span>{"\n"}<span className="kk">{"if"}</span>{" ("}<span className="kv">{"$reg"}</span>{".SharedComputerLicensing "}<span className="kk">{"-ne"}</span>{" "}<span className="ks">{"'1'"}</span>{") "}<span className="kv">{"{"}</span>{"\n    "}<span className="kv">{"$issueFound"}</span>{" = "}<span className="kv">{"$true"}</span>{"\n    "}<span className="kv">{"$reasons"}</span>{" += "}<span className="ks">{"'SCA registry key missing'"}</span>{"\n"}<span className="kv">{"}"}</span>{"\n\n"}<span className="kc">{"# --- Check 2: ClickToRun service must be running ---"}</span>{"\n"}<span className="kv">{"$svc"}</span>{" = "}<span className="km">{"Get-Service"}</span>{" "}<span className="kk">{"-Name"}</span>{" ClickToRunSvc\n"}<span className="kk">{"if"}</span>{" ("}<span className="kv">{"$svc"}</span>{".Status "}<span className="kk">{"-ne"}</span>{" "}<span className="ks">{"'Running'"}</span>{") "}<span className="kv">{"{"}</span>{"\n    "}<span className="kv">{"$issueFound"}</span>{" = "}<span className="kv">{"$true"}</span>{"\n    "}<span className="kv">{"$reasons"}</span>{" += "}<span className="ks">{"\"ClickToRunSvc is $($svc.Status)\""}</span>{"\n"}<span className="kv">{"}"}</span>{"\n\n"}<span className="kc">{"# --- Check 3: License token folder for current user ---"}</span>{"\n"}<span className="kv">{"$licPath"}</span>{" = "}<span className="km">{"Join-Path"}</span>{" "}<span className="kv">{"$env:LOCALAPPDATA"}</span>{" "}<span className="ks">{"'Microsoft\\Office\\Licenses'"}</span>{"\n"}<span className="kk">{"if"}</span>{" ("}<span className="km">{"Test-Path"}</span>{" "}<span className="kv">{"$licPath"}</span>{") "}<span className="kv">{"{"}</span>{"\n    "}<span className="kv">{"$tokens"}</span>{" = "}<span className="km">{"Get-ChildItem"}</span>{" "}<span className="kv">{"$licPath"}</span>{" "}<span className="kk">{"-File"}</span>{" "}<span className="kk">{"-ErrorAction"}</span>{" SilentlyContinue\n    "}<span className="kc">{"# Stale tokens older than 30 days"}</span>{"\n    "}<span className="kv">{"$stale"}</span>{" = "}<span className="kv">{"$tokens"}</span>{" | "}<span className="km">{"Where-Object"}</span>{" "}<span className="kv">{"{"}</span>{" "}<span className="kv">{"$_"}</span>{".LastWriteTime "}<span className="kk">{"-lt"}</span>{" ("}<span className="km">{"Get-Date"}</span>{").AddDays(-30) "}<span className="kv">{"}"}</span>{"\n    "}<span className="kc">{"# Zero-byte (corrupted) tokens"}</span>{"\n    "}<span className="kv">{"$zero"}</span>{"  = "}<span className="kv">{"$tokens"}</span>{" | "}<span className="km">{"Where-Object"}</span>{" "}<span className="kv">{"{"}</span>{" "}<span className="kv">{"$_"}</span>{".Length "}<span className="kk">{"-eq"}</span>{" 0 "}<span className="kv">{"}"}</span>{"\n\n    "}<span className="kk">{"if"}</span>{" ("}<span className="kv">{"$stale"}</span>{" "}<span className="kk">{"-or"}</span>{" "}<span className="kv">{"$zero"}</span>{") "}<span className="kv">{"{"}</span>{"\n        "}<span className="kv">{"$issueFound"}</span>{" = "}<span className="kv">{"$true"}</span>{"\n        "}<span className="kv">{"$reasons"}</span>{" += "}<span className="ks">{"\"Stale($($stale.Count))/Zero-byte($($zero.Count)) license tokens\""}</span>{"\n    "}<span className="kv">{"}"}</span>{"\n"}<span className="kv">{"}"}</span>{"\n\n"}<span className="kc">{"# --- Check 4: Look for activation errors in Office event log (last 24h) ---"}</span>{"\n"}<span className="kv">{"$cutoff"}</span>{" = ("}<span className="km">{"Get-Date"}</span>{").AddHours(-24)\n"}<span className="kv">{"$evt"}</span>{" = "}<span className="km">{"Get-WinEvent"}</span>{" "}<span className="kk">{"-FilterHashtable"}</span>{" "}<span className="kv">{"@{"}</span>{"\n    LogName   = "}<span className="ks">{"'Application'"}</span>{"\n    ProviderName = "}<span className="ks">{"'Microsoft Office 16 Alerts'"}</span>{"\n    StartTime = "}<span className="kv">{"$cutoff"}</span>{"\n"}<span className="kv">{"}"}</span>{" "}<span className="kk">{"-ErrorAction"}</span>{" SilentlyContinue\n\n"}<span className="kk">{"if"}</span>{" ("}<span className="kv">{"$evt"}</span>{") "}<span className="kv">{"{"}</span>{"\n    "}<span className="kv">{"$activationErrors"}</span>{" = "}<span className="kv">{"$evt"}</span>{" | "}<span className="km">{"Where-Object"}</span>{" "}<span className="kv">{"{"}</span>{"\n        "}<span className="kv">{"$_"}</span>{".Message "}<span className="kk">{"-match"}</span>{" "}<span className="ks">{"'activat|0x80004005|0xC004F074|cannot be used to activate'"}</span>{"\n    "}<span className="kv">{"}"}</span>{"\n    "}<span className="kk">{"if"}</span>{" ("}<span className="kv">{"$activationErrors"}</span>{".Count "}<span className="kk">{"-gt"}</span>{" 0) "}<span className="kv">{"{"}</span>{"\n        "}<span className="kv">{"$issueFound"}</span>{" = "}<span className="kv">{"$true"}</span>{"\n        "}<span className="kv">{"$reasons"}</span>{" += "}<span className="ks">{"\"$($activationErrors.Count) activation errors in last 24h\""}</span>{"\n    "}<span className="kv">{"}"}</span>{"\n"}<span className="kv">{"}"}</span>{"\n\n"}<span className="kc">{"# --- Output and exit ---"}</span>{"\n"}<span className="kk">{"if"}</span>{" ("}<span className="kv">{"$issueFound"}</span>{") "}<span className="kv">{"{"}</span>{"\n    "}<span className="km">{"Write-Output"}</span>{" "}<span className="ks">{"\"REMEDIATE: $($reasons -join '; ')\""}</span>{"\n    "}<span className="km">{"exit"}</span>{" 1   "}<span className="kc">{"# Intune: trigger remediation"}</span>{"\n"}<span className="kv">{"}"}</span>{" "}<span className="kk">{"else"}</span>{" "}<span className="kv">{"{"}</span>{"\n    "}<span className="km">{"Write-Output"}</span>{" "}<span className="ks">{"'OK: M365 activation healthy'"}</span>{"\n    "}<span className="km">{"exit"}</span>{" 0   "}<span className="kc">{"# Intune: no action needed"}</span>{"\n"}<span className="kv">{"}"}</span></code></pre>
        </div>
      </div>
      <div className="sec" id="s63">
        <h3>{"Step 6.3 — Remediation Script"}</h3>
        <p>{"This is the heavy hitter. Runs in "}<strong>{"user context"}</strong>{" (so it can clean up "}<code>{"HKCU"}</code>{" and "}<code>{"%LOCALAPPDATA%"}</code>{"), with elevation only where needed for the service restart."}</p>
        <div className="code">
          <div className="code-head">
            <span className="code-lang">{"Remediate-M365Activation.ps1"}</span>
            <button className="code-copy" type="button">{"Copy"}</button>
          </div>
          <pre><code><span className="kc">{"# ============================================================================\n# Script:    Remediate-M365Activation.ps1\n# Purpose:   Auto-heal M365 Apps activation failures on AVD session hosts.\n#            Targets the five most common SCA failure modes:\n#              1. Stale / corrupted license tokens\n#              2. Stale WAM / OneAuth broker cache\n#              3. Polluted identity registry entries\n#              4. Stopped ClickToRun service\n#              5. Missing SCA registry keys (self-heal)\n# Context:   Run in USER context via Intune Remediation\n# Author:    [Your Name]  |  Version: 1.0\n# ============================================================================"}</span>{"\n\n"}<span className="kv">{"$ErrorActionPreference"}</span>{" = "}<span className="ks">{"'SilentlyContinue'"}</span>{"\n"}<span className="kv">{"$VerbosePreference"}</span>{"     = "}<span className="ks">{"'Continue'"}</span>{"\n\n"}<span className="kc">{"# --- Logging setup ---"}</span>{"\n"}<span className="kv">{"$logDir"}</span>{"  = "}<span className="ks">{"\"$env:PROGRAMDATA\\ContosoIT\\ActivationRemediation\""}</span>{"\n"}<span className="kk">{"if"}</span>{" ("}<span className="kk">{"-not"}</span>{" ("}<span className="km">{"Test-Path"}</span>{" "}<span className="kv">{"$logDir"}</span>{")) "}<span className="kv">{"{"}</span>{" "}<span className="km">{"New-Item"}</span>{" "}<span className="kv">{"$logDir"}</span>{" "}<span className="kk">{"-ItemType"}</span>{" Directory "}<span className="kk">{"-Force"}</span>{" | "}<span className="km">{"Out-Null"}</span>{" "}<span className="kv">{"}"}</span>{"\n"}<span className="kv">{"$logFile"}</span>{" = "}<span className="km">{"Join-Path"}</span>{" "}<span className="kv">{"$logDir"}</span>{" "}<span className="ks">{"\"$($env:USERNAME)_$(Get-Date -Format 'yyyyMMdd_HHmmss').log\""}</span>{"\n\n"}<span className="km">{"function"}</span>{" Write-Log "}<span className="kv">{"{"}</span>{"\n    "}<span className="km">{"param"}</span>{"("}<span className="kv">{"$Message"}</span>{", "}<span className="kv">{"$Level"}</span>{" = "}<span className="ks">{"'INFO'"}</span>{")\n    "}<span className="kv">{"$ts"}</span>{" = "}<span className="km">{"Get-Date"}</span>{" "}<span className="kk">{"-Format"}</span>{" "}<span className="ks">{"'yyyy-MM-dd HH:mm:ss'"}</span>{"\n    "}<span className="kv">{"$line"}</span>{" = "}<span className="ks">{"\"[$ts] [$Level] $Message\""}</span>{"\n    "}<span className="km">{"Add-Content"}</span>{" "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$logFile"}</span>{" "}<span className="kk">{"-Value"}</span>{" "}<span className="kv">{"$line"}</span>{"\n    "}<span className="km">{"Write-Verbose"}</span>{" "}<span className="kv">{"$line"}</span>{"\n"}<span className="kv">{"}"}</span>{"\n\nWrite-Log "}<span className="ks">{"\"===== Remediation started for user $env:USERNAME on $env:COMPUTERNAME =====\""}</span>{"\n\n"}<span className="km">{"try"}</span>{" "}<span className="kv">{"{"}</span>{"\n\n    "}<span className="kc">{"# ─────────────────────────────────────────────────────────\n    # FIX 1: Ensure SCA registry keys are present (HKLM — requires admin)\n    # If running in user context, we log and skip. The detection\n    # script flags this and a separate admin-context remediation handles it.\n    # ─────────────────────────────────────────────────────────"}</span>{"\n    "}<span className="kv">{"$isAdmin"}</span>{" = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(\n        [Security.Principal.WindowsBuiltInRole]::Administrator)\n\n    "}<span className="kk">{"if"}</span>{" ("}<span className="kv">{"$isAdmin"}</span>{") "}<span className="kv">{"{"}</span>{"\n        "}<span className="kv">{"$scaPath"}</span>{" = "}<span className="ks">{"'HKLM:\\SOFTWARE\\Microsoft\\Office\\ClickToRun\\Configuration'"}</span>{"\n        "}<span className="km">{"Set-ItemProperty"}</span>{" "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$scaPath"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'SharedComputerLicensing'"}</span>{"     "}<span className="kk">{"-Value"}</span>{" "}<span className="ks">{"'1'"}</span>{" "}<span className="kk">{"-Type"}</span>{" String "}<span className="kk">{"-Force"}</span>{"\n        "}<span className="km">{"Set-ItemProperty"}</span>{" "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$scaPath"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'SCLCacheOverride'"}</span>{"            "}<span className="kk">{"-Value"}</span>{" "}<span className="ks">{"'1'"}</span>{" "}<span className="kk">{"-Type"}</span>{" String "}<span className="kk">{"-Force"}</span>{"\n        "}<span className="km">{"Set-ItemProperty"}</span>{" "}<span className="kk">{"-Path"}</span>{" "}<span className="kv">{"$scaPath"}</span>{" "}<span className="kk">{"-Name"}</span>{" "}<span className="ks">{"'SCLCacheOverrideDirectory'"}</span>{"   `\n            "}<span className="kk">{"-Value"}</span>{" "}<span className="ks">{"'%LOCALAPPDATA%\\Microsoft\\Office\\Licenses'"}</span>{" "}<span className="kk">{"-Type"}</span>{" ExpandString "}<span className="kk">{"-Force"}</span>{"\n        Write-Log "}<span className="ks">{"'SCA registry keys verified/set'"}</span>{"\n    "}<span className="kv">{"}"}</span>{" "}<span className="kk">{"else"}</span>{" "}<span className="kv">{"{"}</span>{"\n        Write-Log "}<span className="ks">{"'Skipping HKLM keys — not running as admin (user context expected)'"}</span>{"\n    "}<span className="kv">{"}"}</span>{"\n\n    "}<span className="kc">{"# ─────────────────────────────────────────────────────────\n    # FIX 2: Clear stale & corrupted license tokens\n    # ─────────────────────────────────────────────────────────"}</span>{"\n    "}<span className="kv">{"$licPath"}</span>{" = "}<span className="km">{"Join-Path"}</span>{" "}<span className="kv">{"$env:LOCALAPPDATA"}</span>{" "}<span className="ks">{"'Microsoft\\Office\\Licenses'"}</span>{"\n    "}<span className="kk">{"if"}</span>{" ("}<span className="km">{"Test-Path"}</span>{" "}<span className="kv">{"$licPath"}</span>{") "}<span className="kv">{"{"}</span>{"\n        "}<span className="kv">{"$tokens"}</span>{" = "}<span className="km">{"Get-ChildItem"}</span>{" "}<span className="kv">{"$licPath"}</span>{" "}<span className="kk">{"-File"}</span>{" "}<span className="kk">{"-Recurse"}</span>{"\n        "}<span className="kv">{"$cutoff"}</span>{" = ("}<span className="km">{"Get-Date"}</span>{").AddDays(-30)\n        "}<span className="kv">{"$toRemove"}</span>{" = "}<span className="kv">{"$tokens"}</span>{" | "}<span className="km">{"Where-Object"}</span>{" "}<span className="kv">{"{"}</span>{"\n            "}<span className="kv">{"$_"}</span>{".LastWriteTime "}<span className="kk">{"-lt"}</span>{" "}<span className="kv">{"$cutoff"}</span>{" "}<span className="kk">{"-or"}</span>{" "}<span className="kv">{"$_"}</span>{".Length "}<span className="kk">{"-eq"}</span>{" 0\n        "}<span className="kv">{"}"}</span>{"\n        "}<span className="kk">{"foreach"}</span>{" ("}<span className="kv">{"$f"}</span>{" "}<span className="kk">{"in"}</span>{" "}<span className="kv">{"$toRemove"}</span>{") "}<span className="kv">{"{"}</span>{"\n            "}<span className="km">{"Remove-Item"}</span>{" "}<span className="kv">{"$f"}</span>{".FullName "}<span className="kk">{"-Force"}</span>{"\n            Write-Log "}<span className="ks">{"\"Removed token: $($f.Name) (age: $((New-TimeSpan $f.LastWriteTime).Days)d, size: $($f.Length)b)\""}</span>{"\n        "}<span className="kv">{"}"}</span>{"\n        Write-Log "}<span className="ks">{"\"License token cleanup complete — removed $($toRemove.Count) file(s)\""}</span>{"\n    "}<span className="kv">{"}"}</span>{"\n\n    "}<span className="kc">{"# ─────────────────────────────────────────────────────────\n    # FIX 3: Clear WAM / OneAuth broker cache for current user\n    # This forces fresh token acquisition on next Office launch\n    # ─────────────────────────────────────────────────────────"}</span>{"\n    "}<span className="kv">{"$oneAuth"}</span>{" = "}<span className="km">{"Join-Path"}</span>{" "}<span className="kv">{"$env:LOCALAPPDATA"}</span>{" "}<span className="ks">{"'Microsoft\\OneAuth'"}</span>{"\n    "}<span className="kk">{"if"}</span>{" ("}<span className="km">{"Test-Path"}</span>{" "}<span className="kv">{"$oneAuth"}</span>{") "}<span className="kv">{"{"}</span>{"\n        "}<span className="km">{"Remove-Item"}</span>{" "}<span className="ks">{"\"$oneAuth\\accounts\\*\""}</span>{" "}<span className="kk">{"-Recurse"}</span>{" "}<span className="kk">{"-Force"}</span>{"\n        "}<span className="km">{"Remove-Item"}</span>{" "}<span className="ks">{"\"$oneAuth\\tokens\\*\""}</span>{"   "}<span className="kk">{"-Recurse"}</span>{" "}<span className="kk">{"-Force"}</span>{"\n        Write-Log "}<span className="ks">{"'OneAuth (WAM) cache cleared'"}</span>{"\n    "}<span className="kv">{"}"}</span>{"\n\n    "}<span className="kv">{"$tokenBroker"}</span>{" = "}<span className="km">{"Join-Path"}</span>{" "}<span className="kv">{"$env:LOCALAPPDATA"}</span>{" "}<span className="ks">{"'Microsoft\\TokenBroker\\Cache'"}</span>{"\n    "}<span className="kk">{"if"}</span>{" ("}<span className="km">{"Test-Path"}</span>{" "}<span className="kv">{"$tokenBroker"}</span>{") "}<span className="kv">{"{"}</span>{"\n        "}<span className="km">{"Remove-Item"}</span>{" "}<span className="ks">{"\"$tokenBroker\\*\""}</span>{" "}<span className="kk">{"-Recurse"}</span>{" "}<span className="kk">{"-Force"}</span>{"\n        Write-Log "}<span className="ks">{"'TokenBroker cache cleared'"}</span>{"\n    "}<span className="kv">{"}"}</span>{"\n\n    "}<span className="kc">{"# ─────────────────────────────────────────────────────────\n    # FIX 4: Reset Office identity registry entries (HKCU)\n    # ─────────────────────────────────────────────────────────"}</span>{"\n    "}<span className="kv">{"$idPaths"}</span>{" = "}<span className="kv">{"@("}</span>{"\n        "}<span className="ks">{"'HKCU:\\Software\\Microsoft\\Office\\16.0\\Common\\Identity'"}</span>{",\n        "}<span className="ks">{"'HKCU:\\Software\\Microsoft\\Office\\Common\\Identity'"}</span>{",\n        "}<span className="ks">{"'HKCU:\\Software\\Microsoft\\Office\\16.0\\Registration'"}</span>{"\n    "}<span className="kv">{")"}</span>{"\n\n    "}<span className="kk">{"foreach"}</span>{" ("}<span className="kv">{"$path"}</span>{" "}<span className="kk">{"in"}</span>{" "}<span className="kv">{"$idPaths"}</span>{") "}<span className="kv">{"{"}</span>{"\n        "}<span className="kk">{"if"}</span>{" ("}<span className="km">{"Test-Path"}</span>{" "}<span className="kv">{"$path"}</span>{") "}<span className="kv">{"{"}</span>{"\n            "}<span className="kc">{"# Back up to log directory before deletion (always have rollback)"}</span>{"\n            "}<span className="kv">{"$backupFile"}</span>{" = "}<span className="km">{"Join-Path"}</span>{" "}<span className="kv">{"$logDir"}</span>{" "}<span className="ks">{"\"$($env:USERNAME)_$($path.Replace('HKCU:\\','').Replace('\\','_'))_$(Get-Date -Format 'yyyyMMdd_HHmmss').reg\""}</span>{"\n            "}<span className="kc">{"# Convert path to reg.exe format and export"}</span>{"\n            "}<span className="kv">{"$regPath"}</span>{" = "}<span className="kv">{"$path"}</span>{".Replace("}<span className="ks">{"'HKCU:\\'"}</span>{", "}<span className="ks">{"'HKEY_CURRENT_USER\\'"}</span>{")\n            "}<span className="km">{"Start-Process"}</span>{" "}<span className="ks">{"'reg.exe'"}</span>{" "}<span className="kk">{"-ArgumentList"}</span>{" "}<span className="ks">{"\"export `\"$regPath`\" `\"$backupFile`\" /y\""}</span>{" "}<span className="kk">{"-Wait"}</span>{" "}<span className="kk">{"-NoNewWindow"}</span>{"\n\n            "}<span className="km">{"Remove-Item"}</span>{" "}<span className="kv">{"$path"}</span>{" "}<span className="kk">{"-Recurse"}</span>{" "}<span className="kk">{"-Force"}</span>{"\n            Write-Log "}<span className="ks">{"\"Reset identity registry: $path (backup at $backupFile)\""}</span>{"\n        "}<span className="kv">{"}"}</span>{"\n    "}<span className="kv">{"}"}</span>{"\n\n    "}<span className="kc">{"# ─────────────────────────────────────────────────────────\n    # FIX 5: Restart ClickToRun service (requires admin or scheduled task)\n    # ─────────────────────────────────────────────────────────"}</span>{"\n    "}<span className="kk">{"if"}</span>{" ("}<span className="kv">{"$isAdmin"}</span>{") "}<span className="kv">{"{"}</span>{"\n        "}<span className="kv">{"$svc"}</span>{" = "}<span className="km">{"Get-Service"}</span>{" "}<span className="kk">{"-Name"}</span>{" ClickToRunSvc\n        "}<span className="kk">{"if"}</span>{" ("}<span className="kv">{"$svc"}</span>{".Status "}<span className="kk">{"-ne"}</span>{" "}<span className="ks">{"'Running'"}</span>{") "}<span className="kv">{"{"}</span>{"\n            "}<span className="km">{"Start-Service"}</span>{" ClickToRunSvc\n            Write-Log "}<span className="ks">{"\"Started ClickToRunSvc (was: $($svc.Status))\""}</span>{"\n        "}<span className="kv">{"}"}</span>{" "}<span className="kk">{"else"}</span>{" "}<span className="kv">{"{"}</span>{"\n            "}<span className="km">{"Restart-Service"}</span>{" ClickToRunSvc "}<span className="kk">{"-Force"}</span>{"\n            Write-Log "}<span className="ks">{"'Restarted ClickToRunSvc'"}</span>{"\n        "}<span className="kv">{"}"}</span>{"\n    "}<span className="kv">{"}"}</span>{"\n\n    "}<span className="kc">{"# ─────────────────────────────────────────────────────────\n    # FIX 6: Force Office license refresh via OSPP\n    # ─────────────────────────────────────────────────────────"}</span>{"\n    "}<span className="kv">{"$ospp"}</span>{" = "}<span className="ks">{"\"$env:ProgramFiles\\Microsoft Office\\Office16\\OSPP.VBS\""}</span>{"\n    "}<span className="kk">{"if"}</span>{" ("}<span className="km">{"Test-Path"}</span>{" "}<span className="kv">{"$ospp"}</span>{") "}<span className="kv">{"{"}</span>{"\n        "}<span className="kv">{"$result"}</span>{" = "}<span className="km">{"Start-Process"}</span>{" "}<span className="ks">{"'cscript.exe'"}</span>{" "}<span className="kk">{"-ArgumentList"}</span>{" "}<span className="ks">{"\"//nologo `\"$ospp`\" /act\""}</span>{" `\n            "}<span className="kk">{"-Wait"}</span>{" "}<span className="kk">{"-NoNewWindow"}</span>{" "}<span className="kk">{"-PassThru"}</span>{"\n        Write-Log "}<span className="ks">{"\"OSPP /act exit code: $($result.ExitCode)\""}</span>{"\n    "}<span className="kv">{"}"}</span>{"\n\n    Write-Log "}<span className="ks">{"'===== Remediation completed successfully ====='"}</span>{"\n    "}<span className="km">{"exit"}</span>{" 0\n\n"}<span className="kv">{"}"}</span>{" "}<span className="km">{"catch"}</span>{" "}<span className="kv">{"{"}</span>{"\n    Write-Log "}<span className="ks">{"\"FATAL: $($_.Exception.Message)\""}</span>{" "}<span className="ks">{"'ERROR'"}</span>{"\n    Write-Log "}<span className="ks">{"\"Stack: $($_.ScriptStackTrace)\""}</span>{" "}<span className="ks">{"'ERROR'"}</span>{"\n    "}<span className="km">{"exit"}</span>{" 1\n"}<span className="kv">{"}"}</span></code></pre>
        </div>
        <div className="ib tip"><b>{"Why This Script Beats Manual Help Desk"}</b>{"It addresses all five known root causes in a single pass, logs every action with rollback (registry backups), uses appropriate context-aware permission checks, and runs silently on a schedule. The user never knows it happened — they just stop seeing activation errors."}</div>
      </div>
      <div className="sec" id="s64">
        <h3>{"Step 6.4 — Deploy via Intune Remediations"}</h3>
        <p>{"Intune Remediations (formerly \"Proactive Remediations\" — renamed by Microsoft in 2024) run on a schedule, return exit codes, and integrate with reporting. Perfect for this kind of self-healing job."}</p>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Save both scripts as UTF-8 BOM files: "}<code>{"Detect-M365ActivationIssue.ps1"}</code>{" and "}<code>{"Remediate-M365Activation.ps1"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"In Intune admin center ("}<code>{"intune.microsoft.com"}</code>{"): "}<strong>{"Devices → Manage devices → Scripts and remediations"}</strong>{". Switch to the "}<strong>{"Remediations"}</strong>{" tab → click "}<strong>{"+ Create script package"}</strong>{". (In some portal versions you'll see this as "}<strong>{"Devices → Remediations"}</strong>{" directly — both lead to the same blade)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Name: "}<code>{"AVD-M365-Activation-AutoHeal-v1"}</code>{" | Description: explain root causes and what the script does | Publisher: your name or team"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Detection script file: upload "}<code>{"Detect-M365ActivationIssue.ps1"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Remediation script file: upload "}<code>{"Remediate-M365Activation.ps1"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Run this script using the logged-on credentials: "}<strong>{"Yes"}</strong>{" (this is critical — needed for HKCU and LOCALAPPDATA access)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"7"}</div>
            <div className="step-t">{"Enforce script signature check: No (lab) or Yes (production with signed scripts)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"8"}</div>
            <div className="step-t">{"Run in 64-bit PowerShell: "}<strong>{"Yes"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"9"}</div>
            <div className="step-t">{"Assign to "}<code>{"GRP-CLOUD-Pilot-Activation-Fix"}</code>{" first, schedule: "}<strong>{"Every 4 hours"}</strong></div>
          </div>
          <div className="step">
            <div className="step-n">{"10"}</div>
            <div className="step-t">{"Monitor for one week via the remediation's "}<strong>{"Device status"}</strong>{" tab — expand scope to "}<code>{"GRP-AD-AVD-Users"}</code>{" when stable"}</div>
          </div>
        </div>
        <div className="ib note"><b>{"The Second Script You'll Build"}</b>{"Because the user-context remediation can't touch HKLM (the SCA keys), build a paired "}<strong>{"system-context"}</strong>{" remediation that runs once per day in admin context to ensure those keys exist. Assign that to the device group (your AVD host pool), not the user group."}</div>
      </div>
      <div className="phase" id="p7">
        <div className="phase-num">{"07"}</div>
        <h2>{"Validation & Documentation"}</h2>
        <p>{"You're not done until you've proven it works and documented the proof."}</p>
      </div>
      <div className="sec">
        <h3>{"Sync & Provisioning Timing Reference"}</h3>
        <p>{"Cloud services in this lab don't update instantaneously. Use this reference to set realistic expectations and to know when to worry vs. wait. All times assume normal tenant load — high-load periods can extend these significantly."}</p>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>{"What's Syncing"}</th>
                <th>{"Typical Time"}</th>
                <th>{"Maximum Normal"}</th>
                <th>{"How to Force / Verify"}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{"Entra Connect — object sync"}</strong><br />{"(users, groups, attributes)"}</td>
                <td>{"Up to 30 minutes"}</td>
                <td>{"30 min default; configurable but not below 30 min"}</td>
                <td>{"On ENTRA01: "}<code>{"Start-ADSyncSyncCycle -PolicyType Delta"}</code></td>
              </tr>
              <tr>
                <td><strong>{"Entra Connect — password hash sync"}</strong></td>
                <td>{"Every 2 minutes"}</td>
                <td>{"2 min interval (separate from object sync)"}</td>
                <td>{"Runs automatically; can't be forced via standard cmdlet"}</td>
              </tr>
              <tr>
                <td><strong>{"Group-based license assignment"}</strong></td>
                <td>{"A few minutes"}</td>
                <td>{"Up to 24 hours under load (Microsoft's documented range)"}</td>
                <td>{"Entra portal → Users → user → Licenses"}</td>
              </tr>
              <tr>
                <td><strong>{"Mailbox provisioning"}</strong><br />{"(after license assignment)"}</td>
                <td>{"Minutes to a few hours"}</td>
                <td>{"Up to 24 hours; longer can require Microsoft Support intervention"}</td>
                <td>{"Exchange admin center → Mailboxes; or "}<code>{"Get-EXOMailbox -Identity user@domain"}</code></td>
              </tr>
              <tr>
                <td><strong>{"Intune auto-enrollment — Entra Joined"}</strong></td>
                <td>{"~15 minutes"}</td>
                <td>{"1 hour; 24-hour timeout before retry stops"}</td>
                <td>{"Settings → Accounts → Access work or school (on device)"}</td>
              </tr>
              <tr>
                <td><strong>{"Intune auto-enrollment — Hybrid Joined"}</strong></td>
                <td>{"1-3 hours"}</td>
                <td>{"24 hours; can fail entirely without intervention"}</td>
                <td><code>{"dsregcmd /status"}</code>{" on session host"}</td>
              </tr>
              <tr>
                <td><strong>{"Intune policy refresh (managed device)"}</strong></td>
                <td>{"8 hours by default"}</td>
                <td>{"8 hours; Intune Management Extension policies start ~60 min after enrollment"}</td>
                <td>{"Settings → Accounts → Access work or school → Info → Sync"}</td>
              </tr>
              <tr>
                <td><strong>{"Conditional Access policy changes"}</strong></td>
                <td>{"1-5 minutes"}</td>
                <td>{"Up to 1 hour for global propagation"}</td>
                <td>{"Test by signing in from an affected user"}</td>
              </tr>
              <tr>
                <td><strong>{"Dynamic group rule re-evaluation"}</strong></td>
                <td>{"A few minutes"}</td>
                <td>{"Up to 24 hours after user attribute changes"}</td>
                <td>{"Entra portal → Groups → group → Members"}</td>
              </tr>
              <tr>
                <td><strong>{"AVD application group assignment"}</strong></td>
                <td>{"Near-immediate"}</td>
                <td>{"~15 minutes for client-side cache refresh"}</td>
                <td>{"Sign out of AVD web client and back in"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="ib tip"><b>{"The Junior Admin's Sync Timing Pattern"}</b>{"When troubleshooting \"why isn't this working yet?\", the diagnostic sequence is: "}<strong>{"wait the typical time"}</strong>{", then "}<strong>{"force the sync if possible"}</strong>{", then "}<strong>{"wait the maximum time"}</strong>{", then "}<strong>{"open a support case"}</strong>{". Don't escalate to support after 5 minutes — most \"broken\" syncs are just in their normal completion window. But don't wait 3 days for a sync that's supposed to complete in minutes either. The table above is your reference for both ends."}</div>
        <div className="ib warn"><b>{"The 24-Hour Enrollment Timeout"}</b>{"Intune has a hard 24-hour timeout on initial enrollment attempts. If a device doesn't successfully enroll within 24 hours of first attempt, the enrollment service stops retrying. The device will appear unenrolled in the Intune portal, and you'll need to manually trigger re-enrollment via "}<code>{"dsregcmd /leave"}</code>{" followed by re-joining. This is especially common with Hybrid Joined AVD hosts where DNS or AD replication issues delay the join past the timeout window."}</div>
      </div>
      <div className="sec">
        <h3>{"End-to-End Test Plan"}</h3>
        <div className="steps">
          <div className="step">
            <div className="step-n">{"1"}</div>
            <div className="step-t">{"Create AD user "}<code>{"jdoe"}</code>{" in "}<code>{"OU=Users/Marketing"}</code>{" with UPN "}<code>{"jdoe@yourtenant.onmicrosoft.com"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"2"}</div>
            <div className="step-t">{"Wait up to 30 minutes for the default Entra Connect delta sync cycle — verify user in Entra with license inherited from "}<code>{"GRP-CLOUD-License-E5"}</code>{". To skip the wait, force an immediate sync from ENTRA01 with "}<code>{"Start-ADSyncSyncCycle -PolicyType Delta"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"3"}</div>
            <div className="step-t">{"Add user to "}<code>{"GRP-AD-AVD-Users"}</code>{" on-prem in AD"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"4"}</div>
            <div className="step-t">{"Sign in to AVD web client → confirm MFA challenge from CA policy"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"5"}</div>
            <div className="step-t">{"Inside the desktop: open Excel → confirm activation success (no yellow exclamation)"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"6"}</div>
            <div className="step-t">{"Verify FSLogix attached profile: "}<code>{"frx list-profiles"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"7"}</div>
            <div className="step-t">{"Verify OneDrive signed in silently and KFM redirected Desktop/Documents"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"8"}</div>
            <div className="step-t">{"Verify Outlook configured automatically with mailbox loaded"}</div>
          </div>
          <div className="step">
            <div className="step-n">{"9"}</div>
            <div className="step-t"><strong>{"Simulate activation failure:"}</strong>{" as admin, delete the user's license tokens: "}<code>{"Remove-Item \"$env:LOCALAPPDATA\\Microsoft\\Office\\Licenses\\*\" -Force"}</code></div>
          </div>
          <div className="step">
            <div className="step-n">{"10"}</div>
            <div className="step-t">{"Force a remediation run from Intune (Devices → device → Run remediation) — confirm tokens restored, log file created in "}<code>{"C:\\ProgramData\\ContosoIT\\ActivationRemediation"}</code></div>
          </div>
        </div>
        <h3>{"Documentation Deliverables"}</h3>
        <ul>
          <li>{"Architecture diagram (the one from Phase 0, drawn in Visio/draw.io)"}</li>
          <li>{"Runbook: \"How to add a new AVD user\" — referencing the groups you built"}</li>
          <li>{"Runbook: \"Activation failure investigation\" — even though it's automated, document the manual process for unusual cases"}</li>
          <li>{"Group strategy document — the table from Step 1.4"}</li>
          <li>{"GPO inventory — name, scope, purpose for each of the four AVD GPOs"}</li>
          <li>{"Intune Remediation reporting export showing detection/remediation counts over time"}</li>
        </ul>
      </div>
    </div>
  )
}

export default AvdEnterpriseWorkspace
