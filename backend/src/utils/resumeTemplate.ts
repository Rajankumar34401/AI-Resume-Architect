/**
 * Generates the HTML string for the Resume PDF.
 * Note: Cover Letter HTML is now handled on the frontend.
 */
export const getResumeHTML = (data: any) => {
  // Ensure we are accessing the nested resumeData if the whole document was passed
  const r = data.resumeData || data;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page { margin: 0; }
          body { 
            font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; 
            line-height: 1.4; 
            color: #1e293b; 
            padding: 40px; 
            background: white;
          }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 15px; margin-bottom: 20px; }
          .name { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0; }
          .contact { font-size: 10px; color: #64748b; margin-top: 5px; font-weight: 500; }
          
          .section-title { 
            font-size: 12px; 
            font-weight: 800; 
            text-transform: uppercase; 
            color: #2563eb; 
            border-bottom: 1px solid #e2e8f0; 
            margin: 20px 0 10px 0; 
            padding-bottom: 2px; 
            letter-spacing: 0.5px;
          }
          
          .summary { font-size: 11px; color: #334155; margin-bottom: 15px; text-align: justify; }
          
          .item { margin-bottom: 12px; page-break-inside: avoid; }
          .item-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; color: #1e293b; }
          .date { color: #64748b; font-size: 10px; font-weight: 500; }
          .item-sub { color: #475569; font-size: 11px; font-weight: 600; margin-bottom: 2px; }
          
          .description-list { font-size: 11px; color: #475569; margin: 4px 0 0 18px; padding: 0; }
          .description-item { margin-bottom: 2px; }
          
          .skill-group { margin-bottom: 6px; font-size: 11px; line-height: 1.2; }
          .skill-category { font-weight: 700; color: #1e293b; margin-right: 5px; }
          .skill-list { color: #475569; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="name">${r.personalInfo?.name || 'Untitled'}</h1>
          <div class="contact">
            ${r.personalInfo?.email || ''}  •  ${r.personalInfo?.phone || ''}  •  ${r.personalInfo?.location || ''}
            ${r.personalInfo?.linkedin ? ` • ${r.personalInfo.linkedin}` : ''}
          </div>
        </div>

        ${r.summary ? `
          <div class="section-title">Professional Summary</div>
          <div class="summary">${r.summary}</div>
        ` : ''}

        ${r.experience?.length ? `
          <div class="section-title">Experience</div>
          ${r.experience.map((exp: any) => `
            <div class="item">
              <div class="item-header">
                <span>${exp.position}</span>
                <span class="date">${exp.startDate} — ${exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div class="item-sub">${exp.company} ${exp.location ? `| ${exp.location}` : ''}</div>
              <ul class="description-list">
                ${exp.responsibilities?.map((res: string) => `<li class="description-item">${res}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        ` : ''}

        ${r.projects?.length ? `
          <div class="section-title">Projects</div>
          ${r.projects.map((proj: any) => `
            <div class="item">
              <div class="item-header">
                <span>${proj.name}</span>
                <span class="date">${proj.link || ''}</span>
              </div>
              <div class="summary" style="margin-top: 4px; margin-bottom: 0;">${proj.description || ''}</div>
            </div>
          `).join('')}
        ` : ''}

        ${r.education?.length ? `
          <div class="section-title">Education</div>
          ${r.education.map((edu: any) => `
            <div class="item">
              <div class="item-header">
                <span>${edu.degree}</span>
                <span class="date">${edu.startDate} — ${edu.endDate}</span>
              </div>
              <div class="item-sub">${edu.institution}</div>
            </div>
          `).join('')}
        ` : ''}

        ${r.skills?.length ? `
          <div class="section-title">Technical Skills</div>
          <div style="margin-top: 5px;">
            ${r.skills.map((group: any) => `
              <div class="skill-group">
                <span class="skill-category">${group.category}:</span>
                <span class="skill-list">${Array.isArray(group.skills) ? group.skills.join(', ') : group.skills}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </body>
    </html>
  `;
};