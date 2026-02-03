export const getResumeHTML = (data: any) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page { margin: 0; }
          body { 
            font-family: 'Inter', 'Helvetica', 'Arial', sans-serif; 
            line-height: 1.5; 
            color: #1e293b; 
            padding: 50px; 
            background: white;
          }
          .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 25px; }
          .name { font-size: 32px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -1px; }
          .role { font-size: 18px; color: #10b981; font-weight: 600; margin-top: 4px; }
          .contact { font-size: 11px; color: #64748b; margin-top: 8px; font-weight: 500; }
          
          .section-title { 
            font-size: 13px; 
            font-weight: 800; 
            text-transform: uppercase; 
            color: #0f172a; 
            border-bottom: 1px solid #e2e8f0; 
            margin: 25px 0 12px 0; 
            padding-bottom: 4px; 
            letter-spacing: 1px;
          }
          
          .summary { font-size: 12.5px; color: #334155; text-align: justify; }
          
          .item { margin-bottom: 18px; page-break-inside: avoid; }
          .item-header { display: flex; justify-content: space-between; font-weight: 700; font-size: 14px; color: #1e293b; }
          .item-sub { color: #10b981; font-size: 12px; font-weight: 600; margin-bottom: 4px; }
          .date { color: #64748b; font-size: 11px; font-weight: 500; }
          
          .description { font-size: 12px; color: #475569; margin-top: 5px; white-space: pre-line; }
          
          .skills-container { display: flex; flex-wrap: wrap; gap: 6px; }
          .skill-tag { 
            background: #f8fafc; 
            border: 1px solid #e2e8f0;
            padding: 4px 10px; 
            border-radius: 6px; 
            font-size: 11px; 
            font-weight: 600;
            color: #475569;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="name">${data.personalInfo?.fullName || 'Untitled'}</h1>
          <div class="role">${data.personalInfo?.role || ''}</div>
          <div class="contact">
            ${data.personalInfo?.email || ''}  •  ${data.personalInfo?.phone || ''}  •  ${data.personalInfo?.location || ''}
          </div>
        </div>

        ${data.summary ? `
          <div class="section-title">Professional Summary</div>
          <p class="summary">${data.summary}</p>
        ` : ''}

        ${data.experience?.length ? `
          <div class="section-title">Experience</div>
          ${data.experience.map((exp: any) => `
            <div class="item">
              <div class="item-header">
                <span>${exp.role}</span>
                <span class="date">${exp.startDate} — ${exp.endDate || 'Present'}</span>
              </div>
              <div class="item-sub">${exp.company}</div>
              <div class="description">${exp.description || ''}</div>
            </div>
          `).join('')}
        ` : ''}

        ${data.projects?.length ? `
          <div class="section-title">Projects</div>
          ${data.projects.map((proj: any) => `
            <div class="item">
              <div class="item-header">
                <span>${proj.title}</span>
                <span class="date">${proj.link || ''}</span>
              </div>
              <div class="description">${proj.description || ''}</div>
            </div>
          `).join('')}
        ` : ''}

        ${data.education?.length ? `
          <div class="section-title">Education</div>
          ${data.education.map((edu: any) => `
            <div class="item">
              <div class="item-header">
                <span>${edu.degree}</span>
                <span class="date">${edu.graduationDate || ''}</span>
              </div>
              <div class="item-sub">${edu.school}</div>
            </div>
          `).join('')}
        ` : ''}

        ${data.skills?.length ? `
          <div class="section-title">Technical Skills</div>
          <div class="skills-container">
            ${data.skills.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        ` : ''}
      </body>
    </html>
  `;
};