import React from 'react';
import './profile.css';

export function Profile() {
  return (
    <main className="container-fluid bg-secondary text-center">
      <div>
      <table>
          <tr>
            <th>Profile</th>
            <th>Recent Posts</th>
          </tr>
          <tr>
            <td> Name: About:</td>
            <td>Recent Posts</td>
          </tr>
          
        </table>
        </div>
    </main>
  );
}