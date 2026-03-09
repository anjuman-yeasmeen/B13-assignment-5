const issuesContainer = document.getElementById("issues-container");
const issueCountElement = document.getElementById("issue-count");
const loader = document.getElementById("loader");
const issueModal = document.getElementById("issue_modal");
const modalContent = document.getElementById("modal-content");

// ইস্যু কাউন্ট বারের ডানপাশে ডট দেখানোর জন্য একটি কন্টেইনার তৈরি (HTML এ না থাকলে এটি সাহায্য করবে)
const statusIndicatorContainer = document.querySelector(".flex.items-center.gap-4");

async function loadIssues(filter = "all") {
  try {
    const currentHeight = issuesContainer.offsetHeight;
    if (currentHeight > 0) {
      issuesContainer.style.minHeight = `${currentHeight}px`;
    }

    loader.style.display = "flex";
    issuesContainer.innerHTML = "";

    const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const responseData = await res.json();
    let issues = responseData.data || responseData;

    if (filter !== "all") {
      issues = issues.filter((issue) => issue.status?.toLowerCase() === filter);
    }

    issueCountElement.innerText = `${issues.length} Issues`;

    if (Array.isArray(issues)) {
      issues.forEach((issue) => {
        const isStatusOpen = issue.status?.toLowerCase() === "open";

        // ১. কার্ডের জন্য PNG ইমেজ পাথ
        const statusIcon = isStatusOpen ? "./assets/Open-Status.png" : "./assets/Closed-Status.png";

        // ২. কার্ডের টপ বর্ডার কালার
        const borderColor = isStatusOpen ? "border-t-emerald-500" : "border-t-[#A855F7]";
        const bgIconColor = isStatusOpen ? "bg-emerald-50" : "bg-purple-50";

        const card = document.createElement("div");
        card.className = `card bg-white shadow-sm border border-gray-100 border-t-4 ${borderColor} rounded-xl transition-all hover:shadow-md cursor-pointer h-full`;

        card.innerHTML = `
                    <div class="card-body p-5 flex flex-col gap-4">
                        <div class="flex justify-between items-center">
                            <div class="w-10 h-10 rounded-full ${bgIconColor} flex items-center justify-center border border-gray-100">
                                <img src="${statusIcon}" class="w-6 h-6" alt="Status">
                            </div>
                            <div class="badge bg-red-50 text-red-600 border border-red-100 font-bold px-4 py-3 rounded-full text-[10px] uppercase tracking-wider">
                                ${issue.priority || "High"}
                            </div>
                        </div>

                        <div class="space-y-2 flex-grow">
                            <h3 class="text-xl font-bold text-slate-800 hover:text-[#5800FF] leading-snug line-clamp-2">
                                ${issue.title}
                            </h3>
                            <p class="text-sm text-gray-400 font-medium">Category: ${issue.category || "General"}</p>
                            <p class="text-sm text-gray-500 line-clamp-2">
                                ${issue.description || "No description available."}
                            </p>
                        </div>

                        <div class="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
                            <div class="badge bg-red-50 text-red-600 border border-red-100 font-medium px-3 py-2 rounded-full text-xs">
                                <img src="./assets/bug.png" class="mr-1 w-4" alt="bug"> ${issue.labels?.[0] || "Bug"}
                            </div>
                            <div class="badge bg-amber-50 text-amber-700 border border-amber-100 font-medium px-3 py-2 rounded-full text-xs">
                                <img src="./assets/help.png" class="mr-1 w-4" alt="help"> Help Wanted
                            </div>
                        </div>

                        <div class="text-xs text-gray-400 mt-2 space-y-1">
                            <p>#${issue.id} by <span class="font-bold text-slate-600">${issue.author || issue.user_name}</span></p>
                            <p>${issue.posted_date || new Date(issue.createdAt).toLocaleDateString("en-GB")}</p>
                        </div>
                    </div>
                `;

        card.onclick = () => fetchSingleIssue(issue.id);
        issuesContainer.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loader.style.display = "none";
    issuesContainer.style.minHeight = "auto";
  }
}

async function searchIssue(keyword = "") {
  try {
    const currentHeight = issuesContainer.offsetHeight;
    if (currentHeight > 0) {
      issuesContainer.style.minHeight = `${currentHeight}px`;
    }

    loader.style.display = "flex";
    issuesContainer.innerHTML = "";

    const res = await fetch(
      `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${keyword}`,
    );
    const responseData = await res.json();
    let issues = responseData.data || responseData;

    // if (filter !== "all") {
    //   issues = issues.filter((issue) => issue.status?.toLowerCase() === filter);
    // }

    issueCountElement.innerText = `${issues.length} Issues`;

    if (Array.isArray(issues)) {
      issues.forEach((issue) => {
        const isStatusOpen = issue.status?.toLowerCase() === "open";

        // ১. কার্ডের জন্য PNG ইমেজ পাথ
        const statusIcon = isStatusOpen ? "./assets/Open-Status.png" : "./assets/Closed-Status.png";

        // ২. কার্ডের টপ বর্ডার কালার
        const borderColor = isStatusOpen ? "border-t-emerald-500" : "border-t-[#A855F7]";
        const bgIconColor = isStatusOpen ? "bg-emerald-50" : "bg-purple-50";

        const card = document.createElement("div");
        card.className = `card bg-white shadow-sm border border-gray-100 border-t-4 ${borderColor} rounded-xl transition-all hover:shadow-md cursor-pointer h-full`;

        card.innerHTML = `
                    <div class="card-body p-5 flex flex-col gap-4">
                        <div class="flex justify-between items-center">
                            <div class="w-10 h-10 rounded-full ${bgIconColor} flex items-center justify-center border border-gray-100">
                                <img src="${statusIcon}" class="w-6 h-6" alt="Status">
                            </div>
                            <div class="badge bg-red-50 text-red-600 border border-red-100 font-bold px-4 py-3 rounded-full text-[10px] uppercase tracking-wider">
                                ${issue.priority || "High"}
                            </div>
                        </div>

                        <div class="space-y-2 flex-grow">
                            <h3 class="text-xl font-bold text-slate-800 hover:text-[#5800FF] leading-snug line-clamp-2">
                                ${issue.title}
                            </h3>
                            <p class="text-sm text-gray-400 font-medium">Category: ${issue.category || "General"}</p>
                            <p class="text-sm text-gray-500 line-clamp-2">
                                ${issue.description || "No description available."}
                            </p>
                        </div>

                        <div class="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
                            <div class="badge bg-red-50 text-red-600 border border-red-100 font-medium px-3 py-2 rounded-full text-xs">
                                <img src="./assets/bug.png" class="mr-1 w-4" alt="bug"> ${issue.labels?.[0] || "Bug"}
                            </div>
                            <div class="badge bg-amber-50 text-amber-700 border border-amber-100 font-medium px-3 py-2 rounded-full text-xs">
                                <img src="./assets/help.png" class="mr-1 w-4" alt="help"> Help Wanted
                            </div>
                        </div>

                        <div class="text-xs text-gray-400 mt-2 space-y-1">
                            <p>#${issue.id} by <span class="font-bold text-slate-600">${issue.author || issue.user_name}</span></p>
                            <p>${issue.posted_date || new Date(issue.createdAt).toLocaleDateString("en-GB")}</p>
                        </div>
                    </div>
                `;

        card.onclick = () => fetchSingleIssue(issue.id);
        issuesContainer.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loader.style.display = "none";
    issuesContainer.style.minHeight = "auto";
  }
}

async function fetchSingleIssue(id) {
  try {
    modalContent.innerHTML = `<div class="flex justify-center py-24"><span class="loading loading-spinner loading-lg text-[#5800FF]"></span></div>`;
    issueModal.showModal();

    const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
    const responseData = await res.json();
    const issue = responseData.data;

    const date = new Date(issue.createdAt).toLocaleDateString("en-GB");
    const isStatusOpen = issue.status?.toLowerCase() === "open";

    // মডালের স্ট্যাটাস ব্যাজ কালার
    const badgeBg = isStatusOpen ? "bg-[#00ab66]" : "bg-[#A855F7]";

    modalContent.innerHTML = `
            <div class="p-10 relative">
                <div class="space-y-3">
                    <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">${issue.title}</h2>
                    <div class="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
                        <span class="${badgeBg} text-white px-4 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                            <i class="fa-solid fa-circle-dot text-[10px]"></i> ${issue.status.toUpperCase()}
                        </span>
                        <span>•</span>
                        <span>Category: <b>${issue.category || "General"}</b></span>
                        <span>•</span>
                        <span>By <span class="font-bold text-slate-700">${issue.author}</span></span>
                    </div>
                </div>

                <div class="flex gap-2 mt-8">
                    <span class="bg-red-50 text-[#ff4d4d] border border-red-100 px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1.5 uppercase tracking-widest">
                        <i class="fa-solid fa-tag"></i> ${issue.labels?.[0] || "BUG"}
                    </span>
                    <span class="bg-orange-50 text-[#f59e0b] border border-orange-100 px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1.5 uppercase tracking-widest">
                        <i class="fa-solid fa-clock"></i> ${date}
                    </span>
                </div>

                <div class="mt-10">
                    <p class="text-slate-600 leading-relaxed text-[17px] font-medium">
                        ${issue.description}
                    </p>
                </div>

                <div class="mt-12 flex justify-between items-center bg-slate-50/80 p-8 rounded-2xl border border-slate-100">
                    <div>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Assignee:</p>
                        <p class="text-xl font-black text-slate-800">${issue.assignee || "Not Assigned"}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Priority:</p>
                        <div class="bg-[#ff4d4d] text-white px-6 py-1.5 rounded-full text-[11px] font-black shadow-lg shadow-red-100 inline-block tracking-[0.2em]">
                            ${issue.priority.toUpperCase()}
                        </div>
                    </div>
                </div>

                <div class="mt-10 flex justify-end">
                    <form method="dialog">
                        <button class="bg-[#6000ff] hover:bg-[#5000d6] text-white px-10 py-3 rounded-xl font-black text-sm transition-all shadow-xl shadow-indigo-100 active:scale-95">
                            Close
                        </button>
                    </form>
                </div>
            </div>
        `;
  } catch (error) {
    console.error("Error:", error);
    modalContent.innerHTML = `<p class="p-10 text-red-500 font-bold text-center">Failed to load details.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("section:first-of-type button");

  buttons.forEach((btn) => {
    btn.onclick = () => {
      buttons.forEach((b) => {
        b.className = "btn btn-outline border-gray-200 text-gray-500 hover:bg-gray-50 px-10";
      });
      btn.className =
        "btn bg-[#5800FF] hover:bg-[#4800D6] text-white border-[#5800FF] px-10 shadow-md";
      const type = btn.innerText.trim().toLowerCase();
      loadIssues(type);
    };
  });

  loadIssues();
});
